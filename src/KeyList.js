import React from 'react'

const KeyList = ({
  dispatch,
  radian,
  inv,
  totalShowing,
  setSlideUp,
  setExpand,
  setScreenFocus,
  setInv,
}) => {
  const keyPress = (payload) => (event) => {
    event.target.blur()
    setScreenFocus(true)

    switch (payload) {
      case '=':
        dispatch({ type: 'EQUAL' })
        setSlideUp(true)
        setExpand(true)
        setInv(false)
        break

      case 'undo':
        dispatch({ type: 'UNDO' })
        setInv(false)
        break

      case 'clear':
        dispatch({ type: 'CLEAR' })
        setInv(false)
        break

      case 'radian':
        dispatch({ type: 'RADIAN' })
        break

      case 'ePowerX':
        dispatch({ type: 'ADD', payload: 'e' })
        dispatch({ type: 'ADD', payload: '^' })
        setInv(false)
        break

      case 'tenPowerX':
        dispatch({ type: 'ADD', payload: '10' })
        dispatch({ type: 'ADD', payload: '^' })
        setInv(false)
        break

      case 'exponentTwo':
        dispatch({ type: 'ADD', payload: '^' })
        dispatch({ type: 'ADD', payload: '2' })
        setInv(false)
        break

      default:
        dispatch({ type: 'ADD', payload })
        setInv(false)
    }
  }

  return (
    <div className='keysContainer'>
      <button className='btn btn--dark btn--angle' onClick={keyPress('radian')}>
        <div className={radian ? undefined : 'btn--angle-disabled'}>Rad</div>
        <div className='btn--angle-divider' />
        <div className={radian ? 'btn--angle-disabled' : undefined}>Deg</div>
      </button>
      <button className='btn btn--dark' onClick={keyPress('!')}>
        x!
      </button>
      <button className='btn btn--dark btn--larger' onClick={keyPress('(')}>
        (
      </button>
      <button className='btn btn--dark btn--larger' onClick={keyPress(')')}>
        )
      </button>
      <button className='btn btn--dark btn--larger' onClick={keyPress('%')}>
        %
      </button>

      {totalShowing ? (
        <button className='btn btn--dark' onClick={keyPress('clear')}>
          AC
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('undo')}>
          CE
        </button>
      )}

      <button
        className={`btn ${inv ? 'btn--light' : 'btn--dark'}`}
        onClick={() => setInv((prevInv) => !prevInv)}
      >
        Inv
      </button>

      {inv ? (
        <button className='btn btn--dark' onClick={keyPress('arcsin')}>
          sin<sup className='btn--sup'>-1</sup>
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('sin')}>
          sin
        </button>
      )}

      {inv ? (
        <button className='btn btn--dark' onClick={keyPress('ePowerX')}>
          e<sup className='btn--sup'>x</sup>
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('ln')}>
          ln
        </button>
      )}

      <button className='btn btn--light btn--larger' onClick={keyPress('7')}>
        7
      </button>
      <button className='btn btn--light btn--larger' onClick={keyPress('8')}>
        8
      </button>
      <button className='btn btn--light btn--larger' onClick={keyPress('9')}>
        9
      </button>
      <button className='btn btn--dark btn--largest' onClick={keyPress('÷')}>
        ÷
      </button>

      <button className='btn btn--dark' onClick={keyPress('π')}>
        π
      </button>

      {inv ? (
        <button className='btn btn--dark' onClick={keyPress('arccos')}>
          cos<sup className='btn--sup'>-1</sup>
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('cos')}>
          cos
        </button>
      )}

      {inv ? (
        <button className='btn btn--dark' onClick={keyPress('tenPowerX')}>
          10<sup className='btn--sup'>x</sup>
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('log')}>
          log
        </button>
      )}

      <button className='btn btn--light btn--larger' onClick={keyPress('4')}>
        4
      </button>
      <button className='btn btn--light btn--larger' onClick={keyPress('5')}>
        5
      </button>
      <button className='btn btn--light btn--larger' onClick={keyPress('6')}>
        6
      </button>
      <button className='btn btn--dark btn--largest' onClick={keyPress('×')}>
        ×
      </button>

      <button className='btn btn--dark' onClick={keyPress('e')}>
        e
      </button>

      {inv ? (
        <button className='btn btn--dark' onClick={keyPress('arctan')}>
          tan<sup className='btn--sup'>-1</sup>
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('tan')}>
          tan
        </button>
      )}

      {inv ? (
        <button className='btn btn--dark' onClick={keyPress('exponentTwo')}>
          x<sup className='btn--sup'>2</sup>
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('√')}>
          √
        </button>
      )}

      <button className='btn btn--light btn--larger' onClick={keyPress('1')}>
        1
      </button>
      <button className='btn btn--light btn--larger' onClick={keyPress('2')}>
        2
      </button>
      <button className='btn btn--light btn--larger' onClick={keyPress('3')}>
        3
      </button>
      <button className='btn btn--dark btn--largest' onClick={keyPress('-')}>
        −
      </button>

      {inv ? (
        <button className='btn btn--dark' onClick={keyPress('Rnd')}>
          Rnd
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('Ans')}>
          Ans
        </button>
      )}

      <button className='btn btn--dark' onClick={keyPress('E')}>
        EXP
      </button>

      {inv ? (
        <button className='btn btn--dark' onClick={keyPress('fracExp')}>
          <sup className='btn--sup'>y</sup>√x
        </button>
      ) : (
        <button className='btn btn--dark' onClick={keyPress('^')}>
          x<sup className='btn--sup'>y</sup>
        </button>
      )}

      <button className='btn btn--light btn--larger' onClick={keyPress('0')}>
        0
      </button>
      <button
        className='btn btn--light btn--largest btn--bold'
        onClick={keyPress('.')}
      >
        .
      </button>
      <button
        className='btn btn--blue btn--largest btn--bold'
        onClick={keyPress('=')}
      >
        =
      </button>
      <button className='btn btn--dark btn--largest' onClick={keyPress('+')}>
        +
      </button>
    </div>
  )
}

export default KeyList
