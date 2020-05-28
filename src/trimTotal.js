const trimTotal = (total) => {
  const totalString = total.toString()
  const totalCut = total.toPrecision(12)

  if (totalString.replace(/^-/, '').replace(/\./, '').length <= 12)
    return totalString
  else if (totalCut.indexOf('e') !== -1) {
    const exponentChars = totalCut.match(/e.*$/)[0].length
    return total
      .toPrecision(12 - exponentChars - (totalCut[0] === '0' ? 1 : 0))
      .replace(/\.?0*e/, 'e')
  } else {
    const arrayChars = totalCut.match(/(^-|\.)/g)
    const reducedTotal = totalCut.substr(
      0,
      12 + (arrayChars ? arrayChars.length : 0)
    )
    return reducedTotal.indexOf('.') !== -1
      ? reducedTotal.replace(/\.?0*$/, '')
      : reducedTotal
  }
}

export default trimTotal
