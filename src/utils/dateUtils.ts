export function getToday(): string {
  return formatDate(new Date());
}

export function formatDate(value: Date): string {
  return value.toISOString().split('T')[0];
}
