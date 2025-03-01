import * as React from 'react';
import { ExportComponent } from 'app/components/ExportComponent';
import { PICT } from 'qd/PICT';
import PICTViewComponent from 'app/components/PICTViewComponent';

export function IndexPage() {
  let examplePICT = PICT.buildExample1();

  return (
    <>
        <div style={{ padding: 10, backgroundColor: '#bbbbbb' }}>
          <div style={{ padding: 10, backgroundColor: '#bbbbbb' }}>
            <ExportComponent pict={examplePICT}></ExportComponent>
          </div>
          <div style={{ padding: 10, backgroundColor: '#bbbbbb' }}>
              <PICTViewComponent pict={examplePICT}></PICTViewComponent>
          </div>
          {examplePICT.toString()}
        </div>
    </>
  );
}
