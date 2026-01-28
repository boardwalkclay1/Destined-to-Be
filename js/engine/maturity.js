export function computeMaturity(lifePath, expression) {
  if (!lifePath || !expression) return null;
  return { value: lifePath.value + expression.value };
}
