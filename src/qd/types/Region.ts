import { IQDrawType } from './IQDrawType';
import ByteBuffer from 'bytebuffer';
import { Rect } from './Rect';
import { textChangeRangeIsUnchanged } from 'typescript';

export class Region implements IQDrawType {
  private boundingBox: Rect;
  private optionalExtras: IQDrawType[];

  constructor(boundingBox: Rect, optionalExtras: IQDrawType[]) {
    this.boundingBox = boundingBox;
    this.optionalExtras = optionalExtras;
  }

  write(buffer: ByteBuffer): void {
    this.boundingBox.write(buffer);
    this.optionalExtras.forEach(extra => {
      extra.write(buffer);
    });
  }

  getSizeInBytes(): number {
    return 8;
  }

  toString(): string {
    return this.boundingBox.toString();
  }
}
