import React, {Fragment} from 'react'
import Header from './Header'
import Frame from './Frame'
import Actions from './Actions'
import ImageBuffer from './ImageBuffer'
import Result from './Result'

class App extends React.Component {

  render() {
    return (
      <Fragment>
        <Header/>
        <Frame/>
        <Actions/>
        <ImageBuffer/>
        <Result/>
      </Fragment>
    )
  }

}

export default App