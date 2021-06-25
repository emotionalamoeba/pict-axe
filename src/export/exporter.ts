import ByteBuffer from 'bytebuffer';
import { PICT } from 'qd/PICT';
import { Rect } from 'qd/types/Rect';

export class Exporter {
  export(pict: PICT): string {
    let buffer: ByteBuffer = new ByteBuffer(64, false);

    // Write empty image size
    buffer.writeUint16(0x0000);

    // Write image boundary size
    let boundaryRectangle = new Rect(0x000a, 0x0014, 0x00af, 0x0078);
    boundaryRectangle.write(buffer);

    // Write the version (currently only support 1)
    let version = 0x1101;
    buffer.writeUint16(version);

    // Write all operations
    pict.getOperations().forEach(operation => {
      operation.write(buffer);
    });

    // Write End-of-File
    buffer.writeUint8(0xff);
    //return buffer.toString();
    // TODO - Picture Definition (Opcodes)
    buffer.flip();

    // Write the size and reset the buffer
    buffer.writeUint16(buffer.limit);
    buffer.reset();

    let hexString = buffer.toHex();

    //return hexString;

    const WORD_SIZE_BYTES = 2;
    let prettyHexString = '';
    do {
      prettyHexString += `${hexString.substr(0, WORD_SIZE_BYTES)} `;
      hexString = hexString.substr(WORD_SIZE_BYTES);
    } while (hexString.length >= WORD_SIZE_BYTES);

    return prettyHexString;
  }
}

/*
data 'PICT' (TITLE_SCREEN_PICT) {
  $"0026 000A 0014 00AF 0078"
  $"1101 01 000A 0000 0000 00FA 0190"
  $"0B 0004 0005"
  $"40 000A 0014 00AF 0078"
  $"51 000A 0014 00AF 0078"
  $"FF"
};*/
