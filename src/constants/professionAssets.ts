export const PROFESSION_DEFAULT_COVERS: Record<string, string> = {
  plumber:
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&auto=format&fit=crop&q=80',
  electrician:
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
  carpenter:
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&auto=format&fit=crop&q=80',
  painter:
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80',
  mason:
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80',
  masonry:
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&auto=format&fit=crop&q=80',
  mechanic:
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&auto=format&fit=crop&q=80',
  mechanics:
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&auto=format&fit=crop&q=80',
  pastry:
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&auto=format&fit=crop&q=80',
  baker:
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1200&auto=format&fit=crop&q=80',
  cleaning:
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&auto=format&fit=crop&q=80',
  cleaner:
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&auto=format&fit=crop&q=80',
  construction:
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
};

export const DEFAULT_FALLBACK_COVER =
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80';

export function getDefaultCoverForProfession(profession?: string): string {
  if (!profession) return DEFAULT_FALLBACK_COVER;
  const key = profession.trim().toLowerCase();
  for (const [profKey, url] of Object.entries(PROFESSION_DEFAULT_COVERS)) {
    if (key.includes(profKey)) {
      return url;
    }
  }
  return DEFAULT_FALLBACK_COVER;
}