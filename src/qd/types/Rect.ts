import { IQDrawType } from './IQDrawType';
import ByteBuffer from 'bytebuffer';

export class Rect implements IQDrawType {
  private top: number;
  private left: number;
  private bottom: number;
  private right: number;

  constructor(top: number, left: number, bottom: number, right: number) {
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }

  getTop = () => this.top;
  getBottom = () => this.bottom;
  getLeft = () => this.left;
  getRight = () => this.right;

  write(buffer: ByteBuffer): void {
    buffer.writeUint16(this.top);
    buffer.writeUint16(this.left);
    buffer.writeUint16(this.bottom);
    buffer.writeUint16(this.right);
  }

  getSizeInBytes(): number {
    return 8;
  }

  getWidth(): number {
    return this.right - this.left;
  }

  getHeight(): number {
    return this.bottom - this.top;
  }

  toString(): string {
    return `${this.top},${this.left},${this.bottom},${this.right}`;
  }
}
