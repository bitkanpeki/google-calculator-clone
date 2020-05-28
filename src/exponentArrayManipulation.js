import { last, isNumeric } from './utilities'

export const convertStringValuesToObjects = (expression) => {
  const operators = ['+', '-', '×', '÷', '□', '(']
  let convertedExpression = []
  let base = []

  for (let index = 0; index < expression.length; index++) {
    if (expression[index] === 'fracExp') {
      while (convertedExpression.length) {
        if (last(convertedExpression).value === ')') {
          while (!base.length || base[0].value !== '(') {
            base.unshift(convertedExpression.pop())
          }
          break
        }

        if (operators.includes(last(convertedExpression).value)) break

        base.unshift(convertedExpression.pop())
      }

      if (!expression[index + 1]) {
        convertedExpression = [
          ...convertedExpression,
          { value: '' },
          { value: '□', show: true },
          { value: '√', show: false },
          ...base,
        ]

        base = []
      } else {
        let exponentEnd = index + 1

        for (
          let expIndex = index + 1;
          expIndex < expression.length;
          expIndex++
        ) {
          if (
            !isNumeric(expression[expIndex]) &&
            expression[expIndex] !== '!' &&
            expression[expIndex] !== '%' &&
            expression[expIndex] !== 'E' &&
            expression[expIndex] !== '□' &&
            expression[expIndex] !== '('
          )
            break
          ++exponentEnd
        }

        const exponent = expression
          .slice(index + 1, exponentEnd)
          .map((item, idx) => {
            if (item === '□' && expression.length === index + 1 + idx + 1)
              return { value: item, show: true }
            return { value: item }
          })

        index += exponent.length

        convertedExpression = [
          ...convertedExpression,
          { value: '' },
          { value: '□', show: false },
          ...exponent,
          { value: '√', show: false },
          ...base,
        ]
        base = []
      }
    } else if (expression[index] === '□') {
      const show = !expression[index + 1]

      convertedExpression.push({ value: expression[index], show })
    } else {
      convertedExpression.push({ value: expression[index] })
    }
  }

  return convertedExpression
}

export const addParentId = (expression) => {
  let parent = 0
  let stackParentheses = []

  return expression
    .reduce((accumulator, current, index) => {
      if (current.value === '□') {
        parent = index
        return [...accumulator, { ...current, id: ++index, parent }]
      }

      if (current.value === '(') {
        stackParentheses = [
          ...stackParentheses,
          {
            id: `filler${stackParentheses.length + 1}`,
            parent,
            value: ')',
            stackParentheses: true,
          },
        ]
      }

      if (current.value === ')') {
        const closingParentheses = [
          ...accumulator,
          { ...current, id: ++index, parent: last(stackParentheses).parent },
        ]
        stackParentheses.pop()

        return closingParentheses
      }

      if (
        !isNumeric(current.value) &&
        current.value !== '!' &&
        current.value !== 'E' &&
        current.value !== '%'
      )
        parent = last(stackParentheses) ? last(stackParentheses).parent : 0

      return [...accumulator, { ...current, id: ++index, parent }]
    }, [])

    .concat(stackParentheses)
}

export const nestChildren = (expression, parent = 0) => {
  return expression.reduce((acc, cur) => {
    if (cur.parent === parent) {
      const children = nestChildren(expression, cur.id)

      if (children.length) cur.children = children

      return [...acc, cur]
    }
    return acc
  }, [])
}
