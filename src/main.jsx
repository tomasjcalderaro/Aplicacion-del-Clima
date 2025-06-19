import React, { StrictMode } from 'react'
import ReactDom from 'react-dom/client'
import { WheatherApp } from './WheatherApp'
import './styles/weatherStyles.css'

ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WheatherApp/>
  </StrictMode>,
)
