import { IQDrawType } from './IQDrawType';
import ByteBuffer from 'bytebuffer';

export class Point implements IQDrawType {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX = () => this.x;
  getY = () => this.y;

  write(buffer: ByteBuffer): void {
    buffer.writeUint16(this.x);
    buffer.writeUint16(this.y);
  }

  getSizeInBytes(): number {
    return 4;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }
}
