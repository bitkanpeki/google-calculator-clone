import React from 'react'
import { isNumeric } from './utilities'

const nestSuperscript = (expression) => {
  let superscriptNestedArray = []

  for (let index = 0; index < expression.length; index++) {
    if (expression[index] === '^') {
      let superscriptEnd = expression.length

      for (let indexSup = index; indexSup < superscriptEnd; indexSup++) {
        if (
          !isNumeric(expression[indexSup]) &&
          expression[indexSup] !== '!' &&
          expression[indexSup] !== '%' &&
          expression[indexSup] !== 'E' &&
          expression[indexSup] !== '^'
        ) {
          superscriptEnd = indexSup
          break
        }
      }

      let superscriptSubExpression = expression.slice(index, superscriptEnd)

      superscriptSubExpression.length === 1
        ? (superscriptSubExpression[0] = (
            <span style={{ color: 'rgb(204, 204, 204)' }}>□</span>
          ))
        : (superscriptSubExpression[0] = (
            <span style={{ fontSize: '0px' }}>□</span>
          ))

      index += superscriptSubExpression.length

      superscriptNestedArray.push(
        <sup>{nestSuperscript(superscriptSubExpression)}</sup>
      )
    }

    superscriptNestedArray.push(expression[index])
  }

  return superscriptNestedArray
}

const addSpaces = (expression) => {
  return expression.map((value, index) => {
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
  })
}

const Display = ({ expression }) => {
  const expressionNestedSuperscript = nestSuperscript(expression),
    expressionNestedWithSpaces = addSpaces(expressionNestedSuperscript)

  return <>{expressionNestedWithSpaces}</>
}

export default Display
