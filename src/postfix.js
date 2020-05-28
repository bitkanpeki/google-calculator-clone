import { isNumeric, last } from './utilities'

const postfix = (expression) => {
  const ops = {
    '+': 2,
    '-': 2,
    '×': 3,
    '÷': 3,
    E: 3,
    unary: 4,
    '□': 5,
    '%': 6,
    '√': 6,
    '!': 6,
    sin: 6,
    cos: 6,
    tan: 6,
    arcsin: 6,
    arccos: 6,
    arctan: 6,
    ln: 6,
    fracExp: 4,
  }
  const functions = [
    '%',
    '√',
    '!',
    'sin',
    'cos',
    'tan',
    'arcsin',
    'arccos',
    'arctan',
    'ln',
    'log',
  ]
  const operators = ['+', '-', '×', '÷', '□', 'E']
  const stack = []
  const postfix = []

  const infix = expression.reduce((acc, cur, idx) => {
    if (
      (cur === '(' ||
        cur === 'sin' ||
        cur === 'cos' ||
        cur === 'tan' ||
        cur === 'arcsin' ||
        cur === 'arccos' ||
        cur === 'arctan' ||
        cur === '√' ||
        cur === 'ln' ||
        cur === 'log' ||
        cur === 'π' ||
        cur === 'e' ||
        cur === 'Ans') &&
      (isNumeric(expression[idx - 1]) ||
        expression[idx - 1] === ')' ||
        expression[idx - 1] === '%')
    )
      acc = [...acc, '×', cur]
    else acc = [...acc, cur]

    return acc
  }, [])

  for (let [idx, token] of infix.entries()) {
    if (
      isNumeric(token) ||
      Number(token) === 0 ||
      token === 'Ans' ||
      token === 'π' ||
      token === 'e'
    ) {
      postfix.push(token)
      continue
    }

    if (functions.includes(token)) {
      stack.push(token)
      continue
    }

    if (token === '-') {
      if (
        idx === 0 ||
        infix[idx - 1] === '(' ||
        infix[idx - 1] === 'E' ||
        operators.includes(infix[idx - 1])
      )
        token = 'unary'
    }

    if (token in ops) {
      while (
        ops[last(stack)] > ops[token] ||
        (ops[last(stack)] >= ops[token] && token !== '□')
      )
        postfix.push(stack.pop())
      stack.push(token)
      continue
    }

    if (token === '(') {
      stack.push(token)
      continue
    }

    if (token === ')') {
      while (last(stack) !== '(') {
        if (stack.length === 0) break
        postfix.push(stack.pop())
      }
      stack.pop()
      continue
    }
  }

  while (stack.length) {
    let op = stack.pop()
    if (op === ')') break
    postfix.push(op)
  }

  return postfix
}

export default postfix
