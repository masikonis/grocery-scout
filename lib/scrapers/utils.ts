export function generateDealId(store: string, name: string): string {
    return `${store}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }