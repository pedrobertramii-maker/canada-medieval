export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

export function ensureUniqueSlug(slug: string, existing: any[]): string {
  const existingSlugs: string[] = existing.map((e: any) => (typeof e === 'string' ? e : e.slug));
  let final = slug;
  let i = 2;
  while (existingSlugs.includes(final)) {
    final = `${slug}-${i++}`;
  }
  return final;
}
