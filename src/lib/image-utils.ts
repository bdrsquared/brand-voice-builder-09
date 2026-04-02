/**
 * Converts a Supabase Storage public URL into an optimised thumbnail URL
 * using Supabase's built-in image transformation endpoint.
 *
 * Falls back to the original URL for non-Supabase images.
 */
export function getThumbnailUrl(
  url: string | null | undefined,
  size: number = 400,
  quality: number = 60
): string | null {
  if (!url) return null;

  // Only transform Supabase storage URLs
  if (!url.includes("/storage/v1/object/public/")) return url;

  return url
    .replace("/storage/v1/object/public/", "/storage/v1/render/image/public/")
    .concat(`?width=${size}&height=${size}&resize=cover&quality=${quality}`);
}
