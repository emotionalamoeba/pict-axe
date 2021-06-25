import { QDState } from './PICT';
import { IQDrawType } from './types/IQDrawType';
import ByteBuffer from 'bytebuffer';

export abstract class AOperation {
  COMPONENT_COUNT = 4;

  abstract opcode: number;
  abstract operands: IQDrawType[];

  write(buffer: ByteBuffer): void {
    buffer.writeUint8(this.opcode);

    this.operands.forEach(operand => {
      operand.write(buffer);
    });
  }

  /**
   * Bresenham's Line Algorithm
   * @param ctx
   * @param imageData
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   */
  drawLine(
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): void {
    // 1 - clip to bounds of image (keeping gradient)
    // TODO - clip better - if both points are beyond the same bound, no line!
    let width = imageData.width;
    let height = imageData.height;

    if (x1 < 0 && x2 < 0) {
      return;
    }

    if (x1 > width && x2 > width) {
      return;
    }

    if (y1 < 0 && y2 < 0) {
      return;
    }

    if (y1 > height && y2 > height) {
      return;
    }

    if (x1 < 0) {
      x1 = 0;
    }

    if (x2 < 0) {
      x2 = 0;
    }

    if (y1 < 0) {
      y1 = 0;
    }

    if (y2 < 0) {
      y2 = 0;
    }

    if (x1 >= width) {
      x1 = width - 1;
    }

    if (x2 >= width) {
      x2 = width - 1;
    }

    if (y1 >= height) {
      y1 = height - 1;
    }

    if (y2 >= height) {
      y2 = height - 1;
    }

    // 2 - render line
    let xi = x1,
      yi = y1;

    let data = imageData.data;

    let dx = Math.abs(x2 - x1);
    let sx = x1 < x2 ? 1 : -1;
    let dy = -Math.abs(y2 - y1);
    let sy = y1 < y2 ? 1 : -1;
    let err = dx + dy; /* error value e_xy */
    while (true) {
      /* loop */
      let index = (x1 + y1 * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;
      if (x1 == x2 && y1 == y2) break;
      let e2 = 2 * err;
      if (e2 >= dy) {
        /* e_xy+e_x > 0 */
        err += dy;
        x1 += sx;
      }
      if (e2 <= dx) {
        /* e_xy+e_y < 0 */
        err += dx;
        y1 += sy;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * TODO - Horribly inefficient, needs to be inline or something
   * @param ctx
   * @param imageData
   * @param x
   * @param y
   */
  setPixel(
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    x: number,
    y: number,
  ) {
    let index = (x + y * imageData.width) * this.COMPONENT_COUNT;
    imageData.data[index++] = 0;
    imageData.data[index++] = 0;
    imageData.data[index++] = 0;
    imageData.data[index++] = 255;
  }

  drawArc(
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    quad: number,
    xc: number,
    yc: number,
    rx: number,
    ry: number,
  ): void {
    let x = rx,
      y = 0;
    let data = imageData.data;
    this.setPixel(ctx, imageData, x + xc, y + yc);

    // When radius is zero only a single
    // point will be printed
    if (rx > 0 || ry > 0) {
      this.setPixel(ctx, imageData, x + xc, -y + yc);
      this.setPixel(ctx, imageData, x + xc, y + yc);
      this.setPixel(ctx, imageData, y + xc, x + yc);
      this.setPixel(ctx, imageData, -y + xc, x + yc);
    }

    // Initialising the value of P
    let P = 1 - rx;
    while (x > y) {
      y++;

      // Mid-point is inside or on the perimeter
      if (P <= 0) P = P + 2 * y + 1;
      // Mid-point is outside the perimeter
      else {
        x--;
        P = P + 2 * y - 2 * x + 1;
      }

      // All the perimeter points have already
      // been printed
      if (x < y) break;

      // Printing the generated point and its
      // reflection in the other octants after
      // translation

      //this.setPixel(ctx, imageData, x + xc, y + yc);
      //this.setPixel(ctx, imageData, -x + xc, y + yc);

      //this.setPixel(ctx, imageData, x + xc, -y + yc);
      this.setPixel(ctx, imageData, -x + xc, -y + yc);

      // If the generated point is on the
      // line x = y then the perimeter points
      // have already been printed
      if (x != y) {
        //this.setPixel(ctx, imageData, y + xc, x + yc);
        //  this.setPixel(ctx, imageData, -y + xc, x + yc);
        this.setPixel(ctx, imageData, y + xc, -x + yc);
        this.setPixel(ctx, imageData, -y + xc, -x + yc);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  drawCircle(
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    xc: number,
    yc: number,
    r: number,
  ): void {
    let x = r,
      y = 0;
    let data = imageData.data;
    let index = (x + xc + (y + yc) * imageData.width) * this.COMPONENT_COUNT;
    data[index++] = 0;
    data[index++] = 0;
    data[index++] = 0;
    data[index++] = 255;

    // When radius is zero only a single
    // point will be printed
    if (r > 0) {
      let index = (x + xc + (-y + yc) * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;

      index = (x + xc + (y + yc) * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;

      index = (y + xc + (x + yc) * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;

      index = (-y + xc + (x + yc) * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;
    }

    // Initialising the value of P
    let P = 1 - r;
    while (x > y) {
      y++;

      // Mid-point is inside or on the perimeter
      if (P <= 0) P = P + 2 * y + 1;
      // Mid-point is outside the perimeter
      else {
        x--;
        P = P + 2 * y - 2 * x + 1;
      }

      // All the perimeter points have already
      // been printed
      if (x < y) break;

      // Printing the generated point and its
      // reflection in the other octants after
      // translation
      index = (x + xc + (y + yc) * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;

      index = (-x + xc + (y + yc) * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;

      index = (x + xc + (-y + yc) * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;

      index = (-x + xc + (-y + yc) * imageData.width) * this.COMPONENT_COUNT;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 0;
      data[index++] = 255;

      // If the generated point is on the
      // line x = y then the perimeter points
      // have already been printed
      if (x != y) {
        index = (y + xc + (x + yc) * imageData.width) * this.COMPONENT_COUNT;
        data[index++] = 0;
        data[index++] = 0;
        data[index++] = 0;
        data[index++] = 255;

        index = (-y + xc + (x + yc) * imageData.width) * this.COMPONENT_COUNT;
        data[index++] = 0;
        data[index++] = 0;
        data[index++] = 0;
        data[index++] = 255;

        index = (y + xc + (-x + yc) * imageData.width) * this.COMPONENT_COUNT;
        data[index++] = 0;
        data[index++] = 0;
        data[index++] = 0;
        data[index++] = 255;

        index = (-y + xc + (-x + yc) * imageData.width) * this.COMPONENT_COUNT;
        data[index++] = 0;
        data[index++] = 0;
        data[index++] = 0;
        data[index++] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  abstract toString(): string;

  abstract render(
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    qdState: QDState,
  ): QDState;
}
