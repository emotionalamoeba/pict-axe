import { Exporter } from 'export/exporter';
import { OvalSizeOperation } from 'qd/Operations/oval/OvalSizeOperation';
import { PaintOvalOperation } from 'qd/Operations/oval/PaintOvalOperation';
import { PICT } from 'qd/PICT';
import { FrameRoundedRectangleOperation } from 'qd/Operations/rect/FrameRoundedRectangleOperation';
import { ClipRegionOperation } from 'qd/Operations/region/ClipRegionOperation';
import { Point } from 'qd/types/Point';
import { Rect } from 'qd/types/Rect';
import { Region } from 'qd/types/Region';
import * as React from 'react';

interface Props {
  pict: PICT;
}

export const ExportComponent = (props: Props) => {
  let exporter = new Exporter();

  let frame = <div>{'Frame : ' + props.pict.getFrameRect().toString()}</div>;

  let list = (
    <ul>
      <li>{frame}</li>
      {props.pict.getOperations().map(op => (
        <li>{op.toString()}</li>
      ))}
    </ul>
  );

  return (
    <React.Fragment>
      <h1>{'Exported PICT Hex'}</h1>
      {exporter.export(props.pict)}      
      {list}
    </React.Fragment>
  );
};
