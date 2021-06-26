import { AOperation } from 'qd/AOperation';
import { QDState } from 'qd/PICT';
import { IQDrawType } from 'qd/types/IQDrawType';
import { Rect } from 'qd/types/Rect';

export class FrameRoundedRectangleOperation extends AOperation {
  opcode: number;
  operands: IQDrawType[];

  constructor(rect: Rect) {
    super();

    this.opcode = 0x40;
    this.operands = [rect];
  }

  roundRect = (ctx, x, y, width, height, radiusX, radiusY, fill, stroke) => {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }

    ctx.beginPath();
    ctx.moveTo(x + radiusX, y);
    ctx.lineTo(x + width - radiusX, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radiusY);
    ctx.lineTo(x + width, y + height - radiusY);
    ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radiusX,
      y + height,
    );
    ctx.lineTo(x + radiusX, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radiusY);
    ctx.lineTo(x, y + radiusY);
    ctx.quadraticCurveTo(x, y, x + radiusX, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  };

  render = (
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    qdState: QDState,
  ) => {
    let rect = this.operands[0] as Rect;

    let ovalSize = qdState.ovalSize;

    this.drawLine(
      ctx,
      imageData,
      rect.getLeft() + ovalSize.getX(),
      rect.getTop(),
      rect.getRight() - ovalSize.getX(),
      rect.getTop(),
    );

    this.drawLine(
      ctx,
      imageData,
      rect.getLeft(),
      rect.getTop() + ovalSize.getY(),
      rect.getLeft(),
      rect.getBottom() - ovalSize.getY(),
    );

    this.drawLine(
      ctx,
      imageData,
      rect.getLeft() + ovalSize.getX(),
      rect.getBottom(),
      rect.getRight() - ovalSize.getX(),
      rect.getBottom(),
    );

    this.drawLine(
      ctx,
      imageData,
      rect.getRight(),
      rect.getTop() + ovalSize.getY(),
      rect.getRight(),
      rect.getBottom() - ovalSize.getY(),
    );

   /* this.drawArc(
      ctx,
      imageData,
      0,
      rect.getLeft() + ovalSize.getX(),
      rect.getTop() + ovalSize.getY(),
      ovalSize.getX(),
      ovalSize.getY(),
    );*/

    let quadrant = 0;
    this.ellipseMidPoint(ctx, imageData, rect.getLeft() + ovalSize.getX(),
    rect.getTop() + ovalSize.getY(),
    ovalSize.getX(),
    ovalSize.getY(), quadrant);

    quadrant = 1;
    this.ellipseMidPoint(ctx, imageData, rect.getRight() - ovalSize.getX(),
    rect.getTop() + ovalSize.getY(),
    ovalSize.getX(),
    ovalSize.getY(), quadrant);

    quadrant = 2;
    this.ellipseMidPoint(ctx, imageData, rect.getLeft() + ovalSize.getX(),
    rect.getBottom() - ovalSize.getY(),
    ovalSize.getX(),
    ovalSize.getY(), quadrant);

    quadrant = 3;
    this.ellipseMidPoint(ctx, imageData, rect.getRight() - ovalSize.getX(),
    rect.getBottom() - ovalSize.getY(),
    ovalSize.getX(),
    ovalSize.getY(), quadrant);

    ctx.putImageData(imageData, 0, 0);

    return qdState;
  };

  corner() {
    
  }

  toString(): string {
    return `Rounded Rectangle: ${this.operands[0].toString()}`;
  }
}
