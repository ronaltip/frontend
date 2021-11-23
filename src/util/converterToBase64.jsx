const pdfToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    let baseURL = '';
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      baseURL = reader.result.toString();
      resolve(baseURL.replace(/([A-Za-z-;./:]*[0-9]+,)/g, ''));
    };
    reader.onerror = error => reject(error);
  });

const generateImgCanvanTobase64 = (image, crop) => {
  const canvas = document.createElement('canvas');
  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext('2d');

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );
  const base64Canvas = canvas.toDataURL('image/jpeg').split(';base64,')[1];
  return base64Canvas;
};

export { pdfToBase64, generateImgCanvanTobase64 };
