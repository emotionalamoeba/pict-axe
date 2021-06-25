import { PICT } from 'qd/PICT';
import React, { useRef, useEffect } from 'react';

interface Props {
  pict: PICT;
}

const PICTViewComponent = (props: Props) => {
  const canvasRef = useRef(null);

  const setpixelated = context => {
    context['imageSmoothingEnabled'] = false; /* standard */
    context['mozImageSmoothingEnabled'] = false; /* Firefox */
    context['oImageSmoothingEnabled'] = false; /* Opera */
    context['webkitImageSmoothingEnabled'] = false; /* Safari */
    context['msImageSmoothingEnabled'] = false; /* IE */
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      0,
      0,
      props.pict.getFrameRect().getWidth(),
      props.pict.getFrameRect().getHeight(),
    );
    ctx.strokeStyle = '#000000';
    setpixelated(ctx);

    props.pict.render(ctx);
  };

  let width = props.pict.getFrameRect().getWidth();
  let height = props.pict.getFrameRect().getHeight();

  useEffect(() => {
    const canvas: any = canvasRef.current;

    const context = canvas.getContext('2d');

    //Our draw come here
    draw(context);
  }, [draw]);

  return (
    <canvas
      style={{ imageRendering: 'pixelated' }}
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
};

export default PICTViewComponent;
