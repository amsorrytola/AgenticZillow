// Curated Unsplash photo IDs (hotlinked via the Unsplash CDN — no API key required).
// Exteriors lead each listing; interiors fill the gallery. A few IDs may 404 over
// time; listings carry multiple photos so the gallery still renders.

const EXTERIORS = [
  "1568605114967-8130f3a36994",
  "1570129477492-45c003edd2be",
  "1576941089067-2de3c901e126",
  "1605276374104-dee2a0ed3cd6",
  "1583608205776-bfd35f0d9f83",
  "1582268611958-ebfd161ef9cf",
  "1600596542815-ffad4c1539a9",
  "1600585154340-be6161a56a0c",
  "1600607687939-ce8a6c25118c",
  "1600566753086-00f18fb6b3ea",
  "1564013799919-ab600027ffc6",
  "1512917774080-9991f1c4c750",
  "1518780664697-55e3ad937233",
  "1505691938895-1758d7feb511",
  "1502672260266-1c1ef2d93688",
  "1493809842364-78817add7ffb",
  "1484154218962-a197022b5858",
  "1449844908441-8829872d2607",
];

const INTERIORS = [
  "1586023492125-27b2c045efd7",
  "1600210492486-724fe5c67fb0",
  "1600121848594-d8644e57abab",
  "1556909114-f6e7ad7d3136",
  "1556911220-bff31c812dba",
  "1565182999561-18d7dc61c393",
  "1567767292278-a4f21aa2d36e",
  "1554995207-c18c203602cb",
  "1583847268964-b28dc8f51f92",
  "1560448204-e02f11c3d0e2",
  "1560185007-cde436f6a4d0",
  "1502005229762-cf1b2da7c5d6",
];

export function unsplash(id: string, w = 900): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

export const HERO_PHOTO = unsplash("1564013799919-ab600027ffc6", 1600);
export const HOME_VALUE_PHOTO = unsplash("1600596542815-ffad4c1539a9", 800);

/** Deterministically build a photo gallery for a listing index. */
export function galleryFor(index: number, count = 6): string[] {
  const ext = EXTERIORS[index % EXTERIORS.length];
  const photos = [unsplash(ext)];
  for (let i = 0; i < count - 1; i++) {
    const pool = i % 2 === 0 ? INTERIORS : EXTERIORS;
    photos.push(unsplash(pool[(index + i + 1) % pool.length]));
  }
  return photos;
}
