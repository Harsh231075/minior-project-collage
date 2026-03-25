export function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}
