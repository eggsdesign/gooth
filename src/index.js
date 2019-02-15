import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

let div = document.createElement('main')
document.body.prepend(div)

ReactDOM.render(<App/>, div)