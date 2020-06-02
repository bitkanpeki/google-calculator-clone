import { isNumeric, last } from './utilities'

const evaluate = (postfix, radian, history) => {
  return postfix
    .reduce((stack, token, i) => {
      if (isNumeric(token)) stack.push(token)
      else if (token === 'Ans')
        history.length ? stack.push(last(history).total) : stack.push(0)
      else if (token === 'π') stack.push(3.14159265358979323846)
      else if (token === 'e') stack.push(2.71828182845904523536)
      else if (
        token === '√' ||
        token === '!' ||
        token === 'sin' ||
        token === 'cos' ||
        token === 'tan' ||
        token === 'arcsin' ||
        token === 'arccos' ||
        token === 'arctan' ||
        token === 'ln' ||
        token === 'log' ||
        token === 'unary'
      ) {
        const operand = Number(stack.pop())

        switch (token) {
          case '√':
            stack.push(Math.sqrt(operand))
            break
          case '!':
            stack.push(factorial(operand))
            break
          case 'sin':
            stack.push(Math.sin(radian ? operand : operand * (Math.PI / 180)))
            break
          case 'cos':
            stack.push(Math.cos(radian ? operand : operand * (Math.PI / 180)))
            break
          case 'tan':
            stack.push(Math.tan(radian ? operand : operand * (Math.PI / 180)))
            break
          case 'arcsin':
            stack.push(
              radian ? Math.asin(operand) : (Math.asin(operand) * 180) / Math.PI
            )
            break
          case 'arccos':
            stack.push(
              radian ? Math.acos(operand) : (Math.acos(operand) * 180) / Math.PI
            )
            break
          case 'arctan':
            stack.push(
              radian ? Math.atan(operand) : (Math.atan(operand) * 180) / Math.PI
            )
            break
          case 'ln':
            stack.push(Math.log(operand))
            break
          case 'log':
            stack.push(Math.log10(operand))
            break
          case 'unary':
            stack.push(-operand)
            break
          default:
            throw new Error('Error found in unary functions')
        }
      } else {
        const right = Number(stack.pop())
        const left = Number(stack.pop())

        switch (token) {
          case '-':
            stack.push(left - right)
            break
          case '+':
            stack.push(left + right)
            break
          case '×':
            stack.push(left * right)
            break
          case '÷':
            stack.push(left / right)
            break
          case '^':
            stack.push(Math.pow(left, right))
            break
          case '%':
            if (!left) {
              stack.push(right / 100)
            } else if (postfix[i + 1] === '-' || postfix[i + 1] === '+') {
              stack.push(left)
              stack.push((left * right) / 100)
            } else {
              stack.push(left)
              stack.push(right / 100)
            }
            break
          case 'E':
            stack.push(left * Math.pow(10, right))
            break
          case 'fracExp':
            stack.push(Math.pow(left, 1 / right))
            break
          default:
            throw new Error('Error found in binary expressions')
        }
      }

      return stack
    }, [])
    .pop()
}

const factorial = (n) => {
  const gamma = (n) => {
    const g = 7
    const p = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7,
    ]
    if (n < 0.5) {
      return Math.PI / Math.sin(n * Math.PI) / gamma(1 - n)
    } else {
      n--
      let x = p[0]
      for (let i = 1; i < g + 2; i++) {
        x += p[i] / (n + i)
      }
      let t = n + g + 0.5
      return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x
    }
  }
  return gamma(n + 1)
}

export default evaluate
