export function computeShadow(expression) {
  if (!expression) return null;
  const shadow = 10 - expression.value;
  return { value: shadow };
}
