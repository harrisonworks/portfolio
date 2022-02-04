const map = (x, a, b, c, d) => {
  return ((x - a) * (d - c)) / (b - a) + c
}

const lerp = (a, b, n) => {
  return (1 - n) * a + n * b
}

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export { map, lerp, randomInteger }
