// The address is stored in parts (data-user, data-domain, data-tld) and only
// assembled here, in the browser. It never appears in the source as one string.
export function assemble(el: HTMLElement): string | null {
  const { user, domain, tld } = el.dataset;
  return user && domain && tld ? `${user}@${domain}.${tld}` : null;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
