/**
 * Profile Image Storage Utility
 * 
 * - Email-scoped localStorage key: profile_image_${user.email}
 * - HTML5 Canvas compression (max 300x300px, quality 0.7)
 * - QuotaExceededError protection and friendly error reporting
 * - State synchronization without backend database overhead
 */

/**
 * Normalizes email and returns email-scoped localStorage key
 */
export function getProfileImageStorageKey(email?: string | null): string | null {
  if (!email || typeof email !== 'string') return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  return `profile_image_${normalized}`;
}

/**
 * Retrieves the stored profile image Data URL for a specific email
 */
export function getStoredProfileImage(email?: string | null): string | null {
  if (typeof window === 'undefined') return null;
  const key = getProfileImageStorageKey(email);
  if (!key) return null;

  try {
    const data = localStorage.getItem(key);
    if (data && data.startsWith('data:image/')) {
      return data;
    }
    return null;
  } catch (err) {
    console.warn('Unable to read profile image from localStorage:', err);
    return null;
  }
}

/**
 * Saves a compressed Base64 profile image for a specific email with QuotaExceeded protection
 */
export function saveStoredProfileImage(
  email: string | null | undefined,
  base64DataUrl: string
): { success: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Storage is only available in browser.' };
  }

  const key = getProfileImageStorageKey(email);
  if (!key) {
    return { success: false, error: 'User email is required to save profile photo.' };
  }

  try {
    localStorage.setItem(key, base64DataUrl);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to save profile image to localStorage:', err);
    const isQuotaExceeded =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014;

    const message = isQuotaExceeded
      ? 'Storage quota exceeded. Your browser storage is full. Please choose a smaller image or clear cache.'
      : 'Failed to save profile image to browser storage.';

    return { success: false, error: message };
  }
}

/**
 * Removes the stored profile image for a specific email
 */
export function removeStoredProfileImage(email?: string | null): void {
  if (typeof window === 'undefined') return;
  const key = getProfileImageStorageKey(email);
  if (!key) return;

  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Unable to remove profile image from localStorage:', err);
  }
}

/**
 * Resizes and compresses an image File using HTML5 Canvas.
 * Outputs a compact Base64 Data URL (e.g. max 300x300, quality 0.7) to comfortably fit in localStorage.
 */
export function compressImageFile(
  file: File,
  maxWidth: number = 300,
  maxHeight: number = 300,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided.'));
    }

    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPEG, PNG, WebP).'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read the image file.'));
    };

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result !== 'string') {
        return reject(new Error('Invalid image file format.'));
      }

      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to load image for compression.'));
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Preserve aspect ratio while constraining to maxWidth and maxHeight
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Create offscreen canvas
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Canvas 2D context is not supported in this browser.'));
          }

          // Draw scaled image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Attempt WebP compression first (smaller size); fall back to JPEG if unsupported
          let dataUrl = '';
          try {
            dataUrl = canvas.toDataURL('image/webp', quality);
          } catch {
            dataUrl = '';
          }

          if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(dataUrl);
        } catch (canvasErr) {
          reject(canvasErr);
        }
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}
