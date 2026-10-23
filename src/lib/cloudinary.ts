/**
 * Cloudinary & Image URL Optimization Utility
 * 
 * Provides automated transformations for Cloudinary-hosted assets:
 * - f_auto: Modern formats (AVIF / WebP) based on browser support
 * - q_auto: Perceptually lossless image compression
 * - w_*: Dynamic responsive width resizing
 * - c_*: Smart cropping (face-focused avatars, bounding limits for logos/banners)
 * 
 * Also optimizes Unsplash query parameters.
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'limit' | 'fit' | 'thumb' | 'scale';
  quality?: 'auto' | number;
  gravity?: 'face' | 'center' | 'auto';
  format?: 'auto';
}

/**
 * Injects Cloudinary transformation parameters into raw upload URLs
 */
export function optimizeCloudinaryUrl(
  url: string | null | undefined,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';

  const cleanUrl = url.trim();

  // Handle Cloudinary URLs
  if (cleanUrl.includes('res.cloudinary.com') && cleanUrl.includes('/upload/')) {
    // If the URL already contains transformation parameters right after /upload/, preserve it
    const uploadIdx = cleanUrl.indexOf('/upload/');
    if (uploadIdx === -1) return cleanUrl;

    const afterUpload = cleanUrl.slice(uploadIdx + 8);
    // Check if afterUpload starts with a version (v\d+) or directly with transformation
    const hasTransformations = !afterUpload.startsWith('v') && afterUpload.includes('/');

    if (hasTransformations) {
      // Already has transformations; do not double-transform
      return cleanUrl;
    }

    const {
      width = 240,
      height,
      crop = 'limit',
      quality = 'auto',
      gravity,
      format = 'auto',
    } = options;

    const transforms: string[] = [];

    if (format) transforms.push(`f_${format}`);
    if (quality) transforms.push(`q_${quality}`);
    if (crop) transforms.push(`c_${crop}`);
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (gravity) transforms.push(`g_${gravity}`);

    const transformStr = transforms.join(',');
    return `${cleanUrl.slice(0, uploadIdx + 8)}${transformStr}/${afterUpload}`;
  }

  // Handle Unsplash URLs
  if (cleanUrl.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(cleanUrl);
      if (options.width) parsed.searchParams.set('w', String(options.width));
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('q', '80');
      return parsed.toString();
    } catch {
      return cleanUrl;
    }
  }

  return cleanUrl;
}

/**
 * Avatar preset: square, face-focused, WebP/AVIF auto, optimal size
 */
export function getOptimizedAvatarUrl(
  url: string | null | undefined,
  size: number = 140
): string {
  return optimizeCloudinaryUrl(url, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Thumbnail preset: small max-width, preserving aspect ratio
 */
export function getOptimizedThumbnailUrl(
  url: string | null | undefined,
  width: number = 160
): string {
  return optimizeCloudinaryUrl(url, {
    width,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Card image preset: medium width (360px), suitable for grid cards
 */
export function getOptimizedCardImageUrl(
  url: string | null | undefined,
  width: number = 420
): string {
  return optimizeCloudinaryUrl(url, {
    width,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Hero image preset: large width (720px - 900px), responsive banner
 */
export function getOptimizedHeroImageUrl(
  url: string | null | undefined,
  width: number = 800
): string {
  return optimizeCloudinaryUrl(url, {
    width,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  });
}
