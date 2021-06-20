export function minMax(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export function getFieldSide(canvas) {
  const canvasWidth = getComputedStyle(canvas).width;
  const canvasHeight = getComputedStyle(canvas).height;
  if (canvasWidth !== canvasHeight) {
    console.error('Field.constructor(): Canvas should be a square');
  }
  return parseInt(canvasWidth);
}
