export function formatInteger(value: number): string {
  return value.toLocaleString('pt-BR');
}

export function formatDecimal(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatReduce(value: number): string {
  if (value >= 1e9) {
    return (
      (value / 1e9).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'B'
    );
  } else if (value >= 1e6) {
    return (
      (value / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'M'
    );
  } else if (value >= 1e3) {
    return (
      (value / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'K'
    );
  } else {
    return formatInteger(value);
  }
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.substring(1);
}

import PhoneNumber from 'libphonenumber-js';

export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');

  const phoneNumberObj = PhoneNumber(digitsOnly, 'BR');
  const formattedNumber = phoneNumberObj!
    .formatInternational()
    .replace(/\s/g, '')
    .replace('+', '');

  return formattedNumber;
}
