export function computeKarmicDebt(lifePath, birthday, expression) {
  const debts = [];

  const check = n => [13,14,16,19].includes(n);

  if (lifePath && check(lifePath.value)) debts.push(lifePath.value);
  if (birthday && check(birthday.value)) debts.push(birthday.value);
  if (expression && check(expression.value)) debts.push(expression.value);

  return { debts };
}
