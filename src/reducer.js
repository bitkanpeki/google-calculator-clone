import { v4 as uuid } from 'uuid'

import {
  isNumeric,
  last,
  last2,
  openParens,
  fillClosingParens,
  randomNumber,
} from './utilities'
import trimTotal from './trimTotal'
import postfix from './postfix'
import evaluate from './evaluate'

const reducer = (state, action) => {
  const se = state.expression
  const ap = action.payload

  switch (action.type) {
    case 'CLEAR':
      return {
        ...state,
        expression: ['0'],
        totalShowing: false,
      }

    case 'UNDO':
      if (se.length === 1 && (se[0].length === 1 || se[0] === 'Ans'))
        return {
          ...state,
          expression: ['0'],
          totalShowing: false,
        }

      if (isNumeric(last(se))) {
        if (last(se).length > 1)
          return {
            ...state,
            expression: [...se.slice(0, -1), last(se).slice(0, -1)],
            totalShowing: false,
          }

        return {
          ...state,
          expression: [...se.slice(0, -1)],
          totalShowing: false,
        }
      }

      if (last(se) === '(') {
        if (
          last2(se) === 'sin' ||
          last2(se) === 'cos' ||
          last2(se) === 'tan' ||
          last2(se) === 'arcsin' ||
          last2(se) === 'arccos' ||
          last2(se) === 'arctan' ||
          last2(se) === '√' ||
          last2(se) === 'ln' ||
          last2(se) === 'log'
        )
          return {
            ...state,
            expression: se.length === 2 ? ['0'] : se.slice(0, -2),
            totalShowing: false,
          }
      }

      return {
        ...state,
        expression: se.slice(0, -1),
        totalShowing: false,
      }

    case 'EQUAL':
      if (state.totalShowing) return state

      if (/^[+\-×÷^(E]$/.test(last(se))) return state

      const expressionWithParentheses = se.concat(fillClosingParens(se))
      const total = Number(
        evaluate(
          postfix(expressionWithParentheses),
          state.radian,
          state.history
        )
      )
      const trimmedTotal = Number.isNaN(total) ? 'Error' : trimTotal(total)

      return {
        ...state,
        expression: [trimmedTotal],
        history: [
          ...state.history,
          {
            id: uuid(),
            expression: expressionWithParentheses,
            total: trimmedTotal,
          },
        ],
        totalShowing: true,
      }

    case 'HISTORY':
      return {
        ...state,
        expression: ap,
        totalShowing: false,
      }

    case 'RADIAN':
      return {
        ...state,
        radian: !state.radian,
      }

    default:
      const expression = () => {
        if (
          state.totalShowing &&
          (ap === 'ln' ||
            ap === 'log' ||
            ap === '√' ||
            ap === 'sin' ||
            ap === 'cos' ||
            ap === 'tan' ||
            ap === 'arcsin' ||
            ap === 'arccos' ||
            ap === 'arctan')
        )
          return [ap, '(']

        if (
          state.totalShowing &&
          (isNumeric(ap) || ap === 'π' || ap === 'e' || ap === 'Ans')
        )
          return [ap]

        if (isNumeric(ap) || ap === 'π' || ap === 'e' || ap === 'Ans') {
          if (
            last(se) === ')' ||
            last(se) === '%' ||
            last(se) === '!' ||
            last(se) === 'Ans' ||
            last(se) === 'e' ||
            last(se) === 'π'
          )
            return [...se, '×', ap]
        }

        if (last(se) === 'E' && !isNumeric(ap) && ap !== '-') return se

        if (last(se) === '-' && last2(se) === 'E' && !isNumeric(ap)) return se

        if (ap === 'Rnd') {
          const rand = randomNumber().toString()

          if (last(se) === 'E') return se

          if (
            isNumeric(last(se)) ||
            last(se) === ')' ||
            last(se) === '%' ||
            last(se) === '!' ||
            last(se) === 'Ans' ||
            last(se) === 'e' ||
            last(se) === 'π'
          )
            return [...se, '×', rand]

          return [...se, rand]
        }

        if (ap === 'fracExp') {
          if (last(se) === 'E' || last(se) === '(') return se

          if (
            last(se) === '÷' ||
            last(se) === '×' ||
            last(se) === '-' ||
            last(se) === '+' ||
            last(se) === '^'
          ) {
            return [...se.slice(0, -1), 'fracExp']
          }

          return [...se, ap]
        }

        if (
          ap === '+' ||
          ap === '×' ||
          ap === '÷' ||
          ap === '^' ||
          ap === '%' ||
          ap === '!' ||
          ap === 'fracExp'
        ) {
          if (last(se) === '-' && (last2(se) === '×' || last2(se) === '÷'))
            return se

          if (se.length === 1 && last(se) === '-') return se

          if (/^[+\-×÷^]$/.test(last(se)) || last(se) === 'fracExp')
            return [...se.slice(0, -1), ap]

          if (last(se) === '(' || last(se) === 'E') return se

          return [...se, ap]
        }

        if (ap === 'Ans' || ap === 'e' || ap === 'π') {
          if (se[0] === '0' && se.length === 1) return [ap]
          return [...se, ap]
        }

        if (ap === '.') {
          if (isNumeric(last(se)) && last2(se) === 'E') return se

          if (
            isNumeric(last(se)) &&
            last2(se) === '-' &&
            se[se.length - 3] === 'E'
          )
            return se

          if (/^(\+|-)?\d+$/.test(last(se)))
            return [...se.slice(0, -1), last(se).concat(ap)]

          return se
        }

        if (ap === '-') {
          if (last(se) === '+' || (se.length === 1 && last(se) === '0'))
            return [...se.slice(0, -1), ap]

          if (last(se) === '-') return se
          return [...se, ap]
        }

        if (
          ap === '√' ||
          ap === 'sin' ||
          ap === 'cos' ||
          ap === 'tan' ||
          ap === 'arcsin' ||
          ap === 'arccos' ||
          ap === 'arctan' ||
          ap === 'ln' ||
          ap === 'log'
        ) {
          if (se[0] === '0' && se.length === 1) return [ap, '(']
          return [...se, ap, '(']
        }

        if (ap === '(') {
          if (se[0] === '0' && se.length === 1) return [ap]
          return [...se, ap]
        }

        if (ap === ')') {
          if (openParens(se) > 0 && last(se) !== '(') return [...se, ap]
          return se
        }

        if (ap === 'E') {
          if (!isNumeric(last(se))) return se
          if (se[0] === '0' && se.length === 1) return se
          if (!isNumeric(last2(se)) && last(se) === '0') return se
          return [...se, ap]
        }

        if (isNumeric(last(se)) && last(se) !== '0')
          return [...se.slice(0, -1), last(se).concat(ap)]

        if (last(se) === '0' && !isNumeric(last2(se)))
          return [...se.slice(0, -1), ap]

        return [...se, ap]
      }

      return {
        ...state,
        expression: expression(),
        totalShowing: false,
      }
  }
}

export default reducer
