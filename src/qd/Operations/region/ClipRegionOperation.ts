import ByteBuffer from 'bytebuffer';
import { AOperation } from 'qd/AOperation';
import { QDState } from 'qd/PICT';
import { IQDrawType } from 'qd/types/IQDrawType';
import { Region } from 'qd/types/Region';

export class ClipRegionOperation extends AOperation {
  opcode: number;
  operands: IQDrawType[];

  constructor(region: Region) {
    super();

    this.opcode = 0x01;
    this.operands = [region];
  }

  write(parentBuffer: ByteBuffer): void {
    let buffer = new ByteBuffer();

    // Placeholders
    buffer.writeUint8(0);
    buffer.writeUint16(0);

    this.operands.forEach(operand => {
      operand.write(buffer);
    });

    let operandSize = buffer.offset - 1;

    buffer.flip();
    buffer.writeUint8(this.opcode);
    buffer.writeUint16(operandSize);

    buffer.reset();

    parentBuffer.append(buffer);
  }

  render = (
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    qdState: QDState,
  ) => {
    return qdState;
  };

  toString(): string {
    return `Clip Region : ${this.operands[0].toString()}`;
  }
}
