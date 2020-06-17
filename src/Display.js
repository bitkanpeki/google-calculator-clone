import React from 'react'
import { v4 as uuid } from 'uuid'
import { isNumeric } from './utilities'

const addSpaces = (expression, index) => {
  const value = expression[index]

  if (/^[+\-×÷]$/.test(value)) return ` ${value} `

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

  return value
}

const nestSuperscript = (expression) => {
  let superscriptNestedArray = []
  let arrayClosingParentheses = []

  for (let index = 0; index < expression.length; index++) {
    if (expression[index] === '(') {
      arrayClosingParentheses.push(
        <span key={uuid()} style={{ color: 'rgb(204, 204, 204)' }}>
          )
        </span>
      )
    }

    if (expression[index] === ')') arrayClosingParentheses.pop()

    if (expression[index] === '^') {
      const slicedExp = expression.slice(index)

      let superscriptEnd

      if (slicedExp[1] === '(') {
        let openedParentheses = 0

        for (const [index, value] of slicedExp.entries()) {
          if (value === '(') openedParentheses += 1

          if (value === ')') {
            openedParentheses -= 1

            if (openedParentheses === 0) {
              superscriptEnd = index + 1
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
            element !== '^'
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

      superscriptNestedArray.push(
        <sup key={uuid()}>{nestSuperscript(superscriptSubExpression)}</sup>
      )

      continue
    }

    superscriptNestedArray.push(addSpaces(expression, index))
  }

  return superscriptNestedArray.concat(arrayClosingParentheses)
}

const Display = ({ expression }) => nestSuperscript(expression)

export default Display
