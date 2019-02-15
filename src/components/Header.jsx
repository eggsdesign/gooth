import React from 'react'
import s from 'styled-components'

export default () => <Header>
  <Title>Gooth!</Title>
  <Subtitle>The EGGS GIF Booth</Subtitle>
</Header>

const Header = s.div`
  text-align: center;
`

const Title = s.h1`
  font-size: 5em;
  margin-top: 20px;
  margin-bottom: 10px;
`

const Subtitle = s.span`
  font-size: 1.4em;
`