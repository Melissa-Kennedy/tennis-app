/** Shrinks a photo to fit within maxDimension and re-encodes it as JPEG so it stores compactly. */
export function compressImage(file: File, maxDimension = 1280, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const sourceUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      const context = canvas.getContext('2d');
      if (!context) {
        resolve(file);
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob ?? file), 'image/jpeg', quality);
    };

    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      reject(new Error("That file couldn't be read as an image."));
    };

    image.src = sourceUrl;
  });
}
