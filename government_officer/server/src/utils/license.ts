export function mintLicenseNumber(nextSeq: number, year = new Date().getFullYear()) {
  const padded = String(nextSeq).padStart(5, '0');
  return `LIC-${year}-${padded}`;
}
