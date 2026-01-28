export function computePlanes(fullName) {
  if (!fullName) return null;

  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('');

  const planes = {
    physical: 0,
    mental: 0,
    emotional: 0,
    intuitive: 0
  };

  letters.forEach(l => {
    if ('BDGJMPRTV'.includes(l)) planes.physical++;
    if ('CFHKLNPQ'.includes(l)) planes.mental++;
    if ('AEIOUY'.includes(l)) planes.emotional++;
    if ('WXYZ'.includes(l)) planes.intuitive++;
  });

  return planes;
}
