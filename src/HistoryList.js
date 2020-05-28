import React from 'react'
import { useOnClickOutside } from './hooks'
import Display from './Display'

const HistoryList = ({ calcHistory, setHistoryOpen, dispatch }) => {
  const historyContainerRef = React.useRef()
  const historyListRef = React.useRef()
  const [borderHistory, setBorderHistory] = React.useState(false)

  useOnClickOutside(historyContainerRef, () => setHistoryOpen(false))

  React.useEffect(() => {
    historyListRef.current.scrollTop = historyListRef.current.scrollTopMax
    setBorderHistory(historyListRef.current.scrollTopMax > 0)
  }, [])

  return (
    <div className='historyContainer' ref={historyContainerRef}>
      <div
        className={`historyIconContainer ${
          borderHistory ? 'historyBottomBorder' : ''
        }`}
      >
        <span className='history-icon' onClick={() => setHistoryOpen(false)}>
          <svg
            focusable='false'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
          >
            <path d='M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'></path>
          </svg>
        </span>
      </div>
      {calcHistory.length ? null : (
        <div className='placeholder'>
          Your calculations and results appear here so that you can reuse them
        </div>
      )}
      <ul
        className={`historyList ${
          borderHistory ? 'historyList-scrollbar' : ''
        }`}
        ref={historyListRef}
      >
        {calcHistory.length > 0 &&
          calcHistory.map((item) => {
            const { id, expression, total } = item
            return (
              <HistoryItem
                key={id}
                expression={expression}
                total={total}
                setHistoryOpen={setHistoryOpen}
                dispatch={dispatch}
              />
            )
          })}
      </ul>
    </div>
  )
}

const HistoryItem = ({ expression, total, setHistoryOpen, dispatch }) => {
  const handleHistoryClick = (payload) => () => {
    dispatch({ type: 'HISTORY', payload })
    setHistoryOpen(false)
  }

  return (
    <li className='history-item'>
      <div
        className='history-item-content'
        onClick={handleHistoryClick(expression)}
      >
        <Display expression={expression} />
      </div>
      <div className='history-item-equal'>=</div>
      <div className='history-item-total' onClick={handleHistoryClick([total])}>
        {total}
      </div>
    </li>
  )
}

export default HistoryList
