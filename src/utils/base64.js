function base64(file, size, callback = () => {}) {
  if (!file) {
    throw new Error('Too few arguments specified in base64');
  }

  const sizeOffset = size || 1048576;
  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

  if (file.size > sizeOffset) {
    return null;
  }

  if (!allowedTypes.includes(file.type)) {
    return null;
  }

  const reader = new FileReader();
  let result = '';

  reader.onloadend = function (e) {
    result = reader.result;
    callback(result);
  };

  reader.readAsDataURL(file);
}

export default base64;
