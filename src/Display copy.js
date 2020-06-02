import React from 'react'
import {
  nestChildren,
  addParentId,
  convertStringValuesToObjects,
} from './exponentArrayManipulation'

const Display = ({ expression }) => (
  <>
    {nestChildren(addParentId(convertStringValuesToObjects(expression))).map(
      (item, idx) => (
        <DisplayItem
          key={item.id}
          expression={expression}
          item={item}
          idx={idx}
        />
      )
    )}
  </>
)

const DisplayItem = ({ expression, item, idx }) => {
  const nestedItems = (item.children || []).map((item) => {
    return (
      <DisplayItem
        key={item.id}
        expression={expression}
        item={item}
        idx={idx}
        type='child'
      />
    )
  })

  return (
    <>
      <DisplayValue expression={expression} item={item} idx={idx} />
      {nestedItems.length > 0 && <sup>{nestedItems}</sup>}
    </>
  )
}

const DisplayValue = ({ expression, item, index }) => {
  const { value, stackParentheses, show } = item

  if (/^[+\-×÷]$/.test(value)) return ` ${value} `

  if (value === '√' && show === false) return value

  if (
    expression[index - 1] !== '(' &&
    (value === 'sin' ||
      value === 'cos' ||
      value === 'tan' ||
      value === 'arcsin' ||
      value === 'arccos' ||
      value === 'arctan' ||
      value === '√' ||
      value === 'ln' ||
      value === 'log')
  )
    return ` ${value}`

  if (stackParentheses) return <span className='paren'>{value}</span>

  if (value === '^') {
    return show ? <span className='supSymbol'>{value}</span> : null
  }

  return value
}

export default Display
