import { AOperation } from 'qd/AOperation';
import { QDState } from 'qd/PICT';
import { IQDrawType } from 'qd/types/IQDrawType';
import { Rect } from 'qd/types/Rect';

export class PaintOvalOperation extends AOperation {
  toString(): string {
    return 'Paint Oval Operation';
  }

  opcode: number;
  operands: IQDrawType[];

  constructor(rect: Rect) {
    super();

    this.opcode = 0x51;
    this.operands = [rect];
  }

  render = (
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    qdState: QDState,
  ) => {
    return qdState;
  };
}
