import { AOperation } from 'qd/AOperation';
import { QDState } from 'qd/PICT';
import { IQDrawType } from 'qd/types/IQDrawType';
import { Point } from 'qd/types/Point';

export class LineOperation extends AOperation {
  toString(): string {
    return 'Line Operation';
  }

  opcode: number;
  operands: IQDrawType[];

  constructor(pointA: Point, pointB: Point) {
    super();

    this.opcode = 0x51;
    this.operands = [pointA, pointB];
  }

  render = (
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    qdState: QDState,
  ): QDState => {
    return qdState;
  };
}
