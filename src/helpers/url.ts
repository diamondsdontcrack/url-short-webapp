export function isValidHttpUrl(candidateUrl: string): boolean {
  try {
    // const url = new URL(candidateUrl)

    return /^https?:$/g.test(new URL(candidateUrl).protocol);
  } catch {
    return false;
  }
}
