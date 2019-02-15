import React, {Fragment} from 'react'

class App extends React.Component {

  render() {
    return (
      <Fragment>
        <div className="app-header">
          <h1 className="app-header-title">Gooth!</h1>
          <span className="app-header-subtitle">The EGGS GIF Booth</span>
        </div>

        <div className="app-frame">
          <video autoPlay id="camera-capture"/>
          <canvas id="canvas-stream" height="640" width="480"/>
          <div id="image-roll" className="hidden"/>
        </div>

        <div className="camera-actions">
          <button id="btn-take-photo">Take photos (10)</button>
          <button id="btn-make-gif" className="button--confirm">Make gif</button>
        </div>

        <div id="image-buffer"/>

        <div id="result-overlay" className="hidden">
          <div className="result-container">
            <img src="" alt="" id="image-gif"/>
            <button id="btn-discard-gif" className="button--cancel">Discard</button>
          </div>
        </div>
      </Fragment>
    )
  }

}

export default App