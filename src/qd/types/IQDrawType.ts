import ByteBuffer from 'bytebuffer';

export interface IQDrawType {
  getSizeInBytes(): number;
  write(buffer: ByteBuffer): void;
  toString(): string;
}
