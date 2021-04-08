import React from 'react'
import { v4 as uuid } from 'uuid'
import { last } from './utilities'

const ClosingParenthese = () => (
  <span style={{ color: 'rgb(204, 204, 204)' }}>)</span>
)

const EmptyExponent = () => (
  <span style={{ color: 'rgb(204, 204, 204)' }}>□</span>
)

const addSpaces = (expression) => {
  return expression.reduce((accumulator, current, index, array) => {
    if (/^[+\-×÷]$/.test(current)) accumulator.push(` ${current} `)
    else if (
      array[index - 1] !== '(' &&
      (current === 'sin' ||
        current === 'cos' ||
        current === 'tan' ||
        current === 'arcsin' ||
        current === 'arccos' ||
        current === 'arctan' ||
        current === '√' ||
        current === 'ln' ||
        current === 'log')
    )
      accumulator.push(` ${current}`)
    else accumulator.push(current)
    return accumulator
  }, [])
}

const addClosingParentheses = (arr) => {
  let arrayClosingParentheses = []
  let newArray = []

  for (const value of arr) {
    if (value === '(') {
      arrayClosingParentheses.push(<ClosingParenthese key={uuid()} />)
    }

    if (value === ')') arrayClosingParentheses.pop()

    newArray.push(value)
  }

  return newArray.concat(arrayClosingParentheses)
}

const nest = (arr) => {
  const operators = ['+', '-', '×', '÷']
  const functions = [
    'ln',
    'log',
    'sin',
    'cos',
    'tan',
    'arcsin',
    'arccos',
    'arctan',
    '√',
  ]
  let newNestedArray = []
  let base = []

  for (let index = 0; index < arr.length; index++) {
    if (arr[index] === 'fracExp' || arr[index] === '^') {
      while (newNestedArray.length) {
        if (last(newNestedArray) === ')') {
          while (!base.length || base[0] !== '(') {
            base.unshift(newNestedArray.pop())
          }
          break
        }

        if (
          last(newNestedArray) === '(' ||
          (typeof last(newNestedArray) === 'string' &&
            operators.includes(last(newNestedArray).trim()))
        )
          break

        base.unshift(newNestedArray.pop())
      }

      console.log(base)

      let exponentEnd = arr.length
      let openedParentheses = 0

      for (
        let indexExponent = index;
        indexExponent < arr.length;
        indexExponent++
      ) {
        if (arr[indexExponent] === '(') {
          if (openedParentheses > 0) {
            openedParentheses += 1
            continue
          }

          if (
            typeof arr[indexExponent - 1] === 'string' &&
            arr[indexExponent - 1] !== 'fracExp' &&
            arr[indexExponent - 1] !== '^' &&
            !functions.includes(arr[indexExponent - 1].trim())
          ) {
            exponentEnd = indexExponent
            break
          }

          openedParentheses += 1
        }

        if (
          arr[indexExponent] === ')' ||
          arr[indexExponent]?.type === ClosingParenthese
        ) {
          if (openedParentheses === 0) exponentEnd = indexExponent
          openedParentheses -= 1
        }

        if (openedParentheses > 0) continue

        if (
          typeof arr[indexExponent] === 'string' &&
          functions.includes(arr[indexExponent].trim())
        ) {
          if (
            arr[indexExponent - 1] === 'fracExp' ||
            arr[indexExponent - 1] === '^'
          ) {
            continue
          } else exponentEnd = indexExponent
        }

        if (
          typeof arr[indexExponent] === 'string' &&
          operators.includes(arr[indexExponent].trim())
        ) {
          exponentEnd = indexExponent
          break
        }
      }

      let exponent = arr.slice(index + 1, exponentEnd)

      if (!exponent.length) exponent.push(<EmptyExponent key={uuid()} />)

      const recurseExponent = <sup key={uuid()}>{nest(exponent)}</sup>

      if (arr[index] === 'fracExp')
        newNestedArray = [...newNestedArray, recurseExponent, '√', ...base]

      if (arr[index] === '^')
        newNestedArray = [...newNestedArray, ...base, recurseExponent]

      if (exponent[0]?.type !== EmptyExponent) index += exponent.length

      base = []
    } else newNestedArray.push(arr[index])
  }

  return newNestedArray
}

const Display = ({ expression }) => {
  return nest(addClosingParentheses(addSpaces(expression)))
}

export default Display
