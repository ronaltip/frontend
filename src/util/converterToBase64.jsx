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
export { pdfToBase64 };
