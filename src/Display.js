import React from 'react'
import { v4 as uuid } from 'uuid'
import { last, isNumeric } from './utilities'

const ClosingParenthese = () => (
  <span style={{ color: 'rgb(204, 204, 204)' }}>)</span>
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
  const operators = ['+', '-', '×', '÷'] // '(' and '^' too ?
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
    if (arr[index] === 'fracExp') {
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

        base.push(newNestedArray.pop())
      }

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

      console.log('exponent trace: ', exponent)
      index += exponent.length

      if (!exponent.length)
        exponent.push(
          <span key={uuid()} style={{ color: 'rgb(204, 204, 204)' }}>
            □
          </span>
        )

      const recurseExponent = <sup key={uuid()}>{nest(exponent)}</sup>

      newNestedArray = [...newNestedArray, recurseExponent, '√', ...base]

      base = []
    } else if (arr[index] === '^') {
      const slicedExp = arr.slice(index)
      let superscriptEnd

      if (slicedExp[1] === '(') {
        let openedParentheses = 0

        for (const [indexParenthese, value] of slicedExp.entries()) {
          if (value === '(') openedParentheses += 1

          if (value.type === ClosingParenthese || value === ')') {
            openedParentheses -= 1

            if (openedParentheses === 0) {
              superscriptEnd = indexParenthese + 1
              break
            }
          }
        }
      } else {
        superscriptEnd = slicedExp.findIndex((element) => {
          return (
            !isNumeric(element) &&
            element !== '!' &&
            element !== '%' &&
            element !== 'E' &&
            element !== '^' &&
            element !== 'fracExp'
          )
        })
      }

      if (superscriptEnd === -1) superscriptEnd = slicedExp.length

      let superscriptSubExpression = slicedExp.slice(0, superscriptEnd)

      if (superscriptSubExpression.length === 1) {
        superscriptSubExpression[0] = (
          <span key={uuid()} style={{ color: 'rgb(204, 204, 204)' }}>
            □
          </span>
        )
      } else {
        superscriptSubExpression[0] = (
          <span key={uuid()} style={{ fontSize: '0px' }}>
            □
          </span>
        )
      }

      index += superscriptSubExpression.length - 1

      newNestedArray.push(
        <sup key={uuid()}>{nest(superscriptSubExpression)}</sup>
      )
    } else {
      newNestedArray.push(arr[index])
    }
  }

  return newNestedArray
}

const Display = ({ expression }) => {
  console.log('original :', addClosingParentheses(expression))
  return nest(addClosingParentheses(addSpaces(expression)))
}

export default Display
