import React from 'react'
import ReactDOM from 'react-dom/client'
import { CustomTags } from './demos/CustomTags'
import { CountrySelector } from './demos/CountrySelector'
import { CustomValidity } from './demos/CustomValidity'
import { UsingTheAPI } from './demos/UsingTheAPI'
import { AsyncSuggestions } from './demos/AsyncSuggestions'

// HACK: Wait for onload to ensure styles are loaded due to a bug with Safari
// <https://github.com/i-like-robots/react-tag-autocomplete/issues/44>
window.onload = () => {
  const container1 = ReactDOM.createRoot(document.getElementById('demo-1'))
  container1.render(<CountrySelector />)

  const container2 = ReactDOM.createRoot(document.getElementById('demo-2'))
  container2.render(<CustomTags />)

  const container3 = ReactDOM.createRoot(document.getElementById('demo-3'))
  container3.render(<CustomValidity />)

  const container4 = ReactDOM.createRoot(document.getElementById('demo-4'))
  container4.render(<AsyncSuggestions />)

  const container5 = ReactDOM.createRoot(document.getElementById('demo-5'))
  container5.render(<UsingTheAPI />)
}
