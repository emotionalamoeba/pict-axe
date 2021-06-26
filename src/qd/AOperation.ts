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
    if (x >= 0 && x < imageData.width && y >=0 && y < imageData.height) {
      let index = (x + y * imageData.width) * this.COMPONENT_COUNT;
      imageData.data[index++] = 0;
      imageData.data[index++] = 0;
      imageData.data[index++] = 0;
      imageData.data[index++] = 255;
    }
  }


  ellipseMidPoint(ctx: CanvasRenderingContext2D,
    imageData: ImageData, xc: number, yc: number, a: number, b:number, quadrant:number)
  {
      let x = 0;
      let y = b;
      let p = Math.round(b*b-a*a*b+0.25*a*a);
      let px = 0;
      let py = a*a*y;

      if (quadrant === 0) {
        //this.setPixel(ctx, imageData, x+xc, -y+yc);
      }
      else {
    //    this.setPixel(ctx, imageData, x+xc, y+yc);
      }
      
      while (px < py)
      {
          if (p>0)
          {
              p += (2*b*b*x - 2*a*a*y + 3*b*b + 2*a*a);
              y--;
          }
          else
          {
              p += (2*b*b*x + 3*b*b);
          }
   
          x++;
   
          px = b*b*x;
          py = a*a*y;
   
          if (quadrant === 0) {
            this.setPixel(ctx, imageData, -x+xc, -y+yc);
          }
          else if (quadrant === 3) {
            this.setPixel(ctx, imageData, x+xc, y+yc);
          }
          else if (quadrant === 1) {
            this.setPixel(ctx, imageData, x+xc, -y+yc);                     
          }
          else {
            this.setPixel(ctx, imageData, -x+xc, y+yc);
          }
      }
   
      p = Math.round(b*b*(x+0.5)*(x+0.5) + a*a*(y-1)*(y-1)-a*a*b*b);
      while (y>0)
      {
          if(p<0)
          {
              p += (b*b*(2*x+2)-a*a*(2*y-3));
              x++;
          }
          else
          {
              p += (3*a*a-2*a*a*y);
          }
   
          y--;
   
          if (quadrant === 0) {
            this.setPixel(ctx, imageData, -x+xc, -y+yc);
          }
          else if (quadrant === 1) {
            this.setPixel(ctx, imageData, x+xc, -y+yc);            
          }
          else if (quadrant === 3) {
            this.setPixel(ctx, imageData, x+xc, y+yc);
          }
          else {
            this.setPixel(ctx, imageData, -x+xc, y+yc);
          }                                        
      }
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
 
  abstract toString(): string;

  abstract render(
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    qdState: QDState,
  ): QDState;
}
