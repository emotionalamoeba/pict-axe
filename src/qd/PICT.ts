import { AOperation } from './AOperation';
import { OvalSizeOperation } from './Operations/oval/OvalSizeOperation';
import { FrameRoundedRectangleOperation } from './Operations/rect/FrameRoundedRectangleOperation';
import { ClipRegionOperation } from './Operations/region/ClipRegionOperation';
import { Point } from './types/Point';
import { Rect } from './types/Rect';
import { Region } from './types/Region';

export interface QDState {
  ovalSize: Point;
}

export class PICT {
  private boundary: Rect;
  private operationList: AOperation[] = [];
  private undoOperation: AOperation | undefined = undefined;

  constructor(rect: Rect) {
    this.boundary = rect;
  }

  getFrameRect = () => {
    return this.boundary;
  };

  render = (ctx: CanvasRenderingContext2D) => {
    let qdState: QDState = { ovalSize: new Point(0, 0) };
    let imageData = ctx.getImageData(
      0,
      0,
      this.boundary.getWidth(),
      this.boundary.getHeight(),
    );

    this.operationList.forEach(operation => {
      qdState = operation.render(ctx, imageData, qdState);
    });
  };

  static buildExample1 = () => {
    let boundaryRect = new Rect(0x000a, 0x0014, 0x00af, 0x0078);
    let pict = new PICT(boundaryRect);

    //pict.addOperation(new PaintOvalOperation(new Rect(32, 32, 64, 64)));
    pict.addOperation(
      new ClipRegionOperation(
        new Region(new Rect(0x0000, 0x0000, 0x00fa, 0x0190), []),
      ),
    );

    pict.addOperation(new OvalSizeOperation(new Point(0x0004, 0x0005)));
    pict.addOperation(
      new FrameRoundedRectangleOperation(
        new Rect(0x000a, 0x0014, 0x00af, 0x0078),
      ),
    );
    return pict;
  };

  addOperation(operation: AOperation) {
    this.operationList.push(operation);
  }

  undo() {
    this.undoOperation = this.operationList.pop();
  }

  redo() {
    if (this.undoOperation) {
      this.addOperation(this.undoOperation);
      this.undoOperation = undefined;
    }
  }

  getOperations() {
    return this.operationList;
  }
}
