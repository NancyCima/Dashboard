export const isValidCUIT = (cuit: string): boolean => {
  if (!/^\d{11}$/.test(cuit)) return false;

  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += parseInt(cuit[i]) * multipliers[i];
  }

  const remainder = sum % 11;
  const verificationDigit = remainder === 0 ? 0 : remainder === 1 ? 9 : 11 - remainder;

  return verificationDigit === parseInt(cuit[10]);
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};