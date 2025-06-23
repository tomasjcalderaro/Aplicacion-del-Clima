import React, { StrictMode } from 'react'
import ReactDom from 'react-dom/client'
import { WeatherApp } from './weatherApp'
import './styles/weatherStyles.css'

ReactDom.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WeatherApp/>
  </StrictMode>,
)
