import React from 'react'
import Display from './Display'
import { useOnClickOutside } from './hooks'
import { last } from './utilities'

const Screen = ({
  state,
  slideUp,
  setSlideUp,
  expand,
  setExpand,
  screenFocus,
  setScreenFocus,
}) => {
  const screenExpressionRef = React.useRef()
  useOnClickOutside(screenExpressionRef, () => setScreenFocus(false))

  const showLastAnswer = () => {
    if (state.totalShowing) {
      if (!state.history.length) return null

      return (
        <>
          <Display expression={last(state.history).expression} />
          <span className='equal'>=</span>
        </>
      )
    } else {
      if (!state.history.length) return 'Ans = 0'

      return `Ans = ${last(state.history).total}`
    }
  }

  return (
    <div className={screenFocus ? 'screenFocus' : 'screen'}>
      <div
        className={`screenTotal ${expand ? 'animationExpand' : ''}`}
        onAnimationEnd={() => setExpand(false)}
      >
        {showLastAnswer()}
      </div>
      <div
        ref={screenExpressionRef}
        className={`screenExpression ${slideUp ? 'animationSlideUp' : ''}`}
        onAnimationEnd={() => setSlideUp(false)}
        onClick={() => setScreenFocus(true)}
      >
        <span>
          <Display expression={state.expression} />
        </span>
      </div>
    </div>
  )
}

export default Screen
