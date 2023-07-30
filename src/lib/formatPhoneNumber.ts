import PhoneNumber from "libphonenumber-js";

export function formatPhoneNumber(phoneNumber: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  const phoneNumberObj = PhoneNumber(digitsOnly, "BR");
  const formattedNumber = phoneNumberObj!
    .formatInternational()
    .replace(/\s/g, "")
    .replace("+", "");

  return formattedNumber;
}
