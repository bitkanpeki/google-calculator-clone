import React from 'react'
import './App.css'
import reducer from './reducer'
import HistoryToggle from './HistoryToggle'
import HistoryList from './HistoryList'
import Screen from './Screen'
import KeyList from './KeyList'

const App = () => {
  const initialState = {
    expression: ['0'],
    history: [],
    totalShowing: true,
    radian: true,
  }

  
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [slideUp, setSlideUp] = React.useState(false)
  const [expand, setExpand] = React.useState(false)
  const [screenFocus, setScreenFocus] = React.useState(false)
  const [inv, setInv] = React.useState(false)

  return (
    <div className='app'>
      <HistoryToggle historyOpen={historyOpen} setHistoryOpen={setHistoryOpen}>
        <HistoryList
          calcHistory={state.history}
          setHistoryOpen={setHistoryOpen}
          dispatch={dispatch}
        />
      </HistoryToggle>

      <div className='display'>
        <Screen
          state={state}
          slideUp={slideUp}
          setSlideUp={setSlideUp}
          expand={expand}
          setExpand={setExpand}
          screenFocus={screenFocus}
          setScreenFocus={setScreenFocus}
        />
        <KeyList
          dispatch={dispatch}
          radian={state.radian}
          inv={inv}
          totalShowing={state.totalShowing}
          setSlideUp={setSlideUp}
          setExpand={setExpand}
          setScreenFocus={setScreenFocus}
          setInv={setInv}
        />
      </div>
    </div>
  )
}

export default App
