// MODULES
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// STYLES
import styles from './Tokenomics.module.scss';

function Tokenomics({ data }) {
  const canvasRef = useRef();
  const tokenomics = data.tokenomics.split('_');
  const randomColors = ['#3c7ef8', '#4bf83c', '#9b56f5', '#ddcb2a'];

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const DPI = 2 * Math.PI;
      const LINE_WIDTH = 50;
      const RADIUS = 100;
      const X = RADIUS + LINE_WIDTH / 2;
      const Y = RADIUS + LINE_WIDTH / 2;

      let startAng = 0;
      let endAng = 0;

      for (let i = 0; i < tokenomics.length; i++) {
        const coverage = Number(tokenomics[i].split('-')[1]);

        ctx.beginPath();
        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeStyle = randomColors[i];
        endAng = (DPI / 100) * coverage + startAng;
        ctx.arc(X, Y, RADIUS, startAng, endAng);
        startAng = endAng;
        ctx.stroke();
      }
    }
  }, []);

  return (
    <div className={cn(styles['container'])}>
      <div className={cn(styles['title'])}>TOKENOMICS</div>

      <div className={cn(styles['tokenomics'], 'flx-btw-str')}>
        <div className={cn(styles['left'])}>
          <canvas
            width="250"
            height="250"
            ref={canvasRef}
            className={cn(styles['graph'])}
          ></canvas>
        </div>
        <div className={cn(styles['right'], 'flx-str-str')}>
          {tokenomics.map((current, index) => {
            const parts = current.split('-');
            const title = parts[0];
            const coverage = Number(parts[1]);

            return (
              <div key={index} className={cn(styles['coverage'])}>
                <div className={cn(styles['coverage-title'])}>
                  {title} {coverage}%
                </div>
                <div className={cn(styles['coverage-bar'])}>
                  <div
                    style={{
                      width: coverage + '%',
                      backgroundColor: randomColors[index],
                    }}
                    className={cn(styles['coverage-progress'])}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Tokenomics;
