import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { ExportComponent } from 'app/components/ExportComponent';
import { PICT } from 'qd/PICT';
import PICTViewComponent from 'app/components/PICTViewComponent';

export function IndexPage() {
  let examplePICT = PICT.buildExample1();

  return (
    <>
      <Helmet>
        <title>PICT Editor</title>
        <meta
          name="description"
          content="A React Boilerplate application homepage"
        />
      </Helmet>
        <div style={{ padding: 10, backgroundColor: '#bbbbbb' }}>
          <ExportComponent pict={examplePICT}></ExportComponent>
          <PICTViewComponent pict={examplePICT}></PICTViewComponent>
          {examplePICT.toString()}
        </div>
    </>
  );
}
