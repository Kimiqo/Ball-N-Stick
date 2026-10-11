export function isCeo(person: { role: string }) {
  return /\b(?:CEO|Chief Executive Officer)\b/i.test(person.role)
    && !/\b(?:Deputy|Assistant)\b/i.test(person.role);
}

export function orderPeople<T extends { role: string }>(people: T[]): T[] {
  return [...people.filter(isCeo), ...people.filter(person => !isCeo(person))];
}
