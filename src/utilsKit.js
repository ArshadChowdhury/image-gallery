export function formatByNumber(number, text) {
  if (number === 1) {
    return text;
  } else {
    return text + "s";
  }
}
