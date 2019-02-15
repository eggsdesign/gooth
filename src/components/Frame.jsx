import React from 'react'

export default () => <div className="app-frame">
  <video autoPlay id="camera-capture"/>
  <canvas id="canvas-stream" height="640" width="480"/>
  <div id="image-roll" className="hidden"/>
</div>