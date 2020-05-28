export const isNumeric = (n) => !Number.isNaN(Number(n))

export const last = (a) => a[a.length - 1]

export const last2 = (a) => a[a.length - 2]

export const openParens = (arr) => {
  return arr.reduce((acc, cur) => {
    if (cur === '(') return ++acc
    if (cur === ')') return --acc
    return acc
  }, 0)
}

export const randomNumber = () => {
  const rand = Math.random()
  const power = Math.pow(10, 7)

  return Math.floor(rand * power) / power
}

export const fillClosingParens = (arr) => new Array(openParens(arr)).fill(')')
