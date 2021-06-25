import { AOperation } from 'qd/AOperation';
import { QDState } from 'qd/PICT';
import { IQDrawType } from 'qd/types/IQDrawType';
import { Point } from 'qd/types/Point';

export class OvalSizeOperation extends AOperation {
  opcode: number;
  operands: IQDrawType[];

  constructor(point: Point) {
    super();

    this.opcode = 0x0b;
    this.operands = [point];
  }

  render = (
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    qdState: QDState,
  ) => {
    let ovalSize = this.operands[0] as Point;
    qdState.ovalSize = ovalSize;
    return qdState;
  };

  toString(): string {
    return `Oval Size: ${this.operands[0].toString()}`;
  }
}
