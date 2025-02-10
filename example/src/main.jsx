import React from 'react'
import ReactDOM from 'react-dom/client'
import { CountrySelector } from './demos/CountrySelector'
import { CustomTags } from './demos/CustomTags'
import { CustomValidity } from './demos/CustomValidity'
import { AsyncSuggestions } from './demos/AsyncSuggestions'
import { UsingTheAPI } from './demos/UsingTheAPI'
import { CustomTagList } from './demos/CustomTagList'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Container = ({Item, dnd}) => (dnd === true) 
    ? <DndProvider backend={HTML5Backend}><Item /></DndProvider>
    : <Item />

// HACK: Wait for onload to ensure styles are loaded due to a bug with Safari
// <https://github.com/i-like-robots/react-tag-autocomplete/issues/44>
window.onload = () => {
  const container1 = ReactDOM.createRoot(document.getElementById('demo-1'))
  
  container1.render(<Container Item={CountrySelector} dnd={true} />)

  const container2 = ReactDOM.createRoot(document.getElementById('demo-2'))
  container2.render(<Container Item={CustomTags}  dnd={false} />)

  const container3 = ReactDOM.createRoot(document.getElementById('demo-3'))
  container3.render(<Container Item={CustomValidity}  dnd={false} />)

  const container4 = ReactDOM.createRoot(document.getElementById('demo-4'))
  container4.render(<Container Item={AsyncSuggestions}  dnd={false} />)

  const container5 = ReactDOM.createRoot(document.getElementById('demo-5'))
  container5.render(<Container Item={UsingTheAPI}  dnd={false} />)

  const container6 = ReactDOM.createRoot(document.getElementById('demo-6'))
  container6.render(<Container Item={CustomTagList}  dnd={false} />)
}
