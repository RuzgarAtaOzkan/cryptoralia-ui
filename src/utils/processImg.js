function processImg(file, size, imgRef, callback = () => {}, permissions = '') {
  if (!file || !imgRef) {
    return;
  }

  const sizeOffset = size || 1048576;
  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

  if (file.size > sizeOffset) {
    callback('size-error');
    imgRef.current.src = '';
    return;
  }

  if (!allowedTypes.includes(file.type)) {
    callback('type-error');
    imgRef.current.src = '';
    return;
  }

  const reader = new FileReader();

  reader.onloadend = function (e) {
    imgRef.current.src = reader.result;

    const i = new Image();

    i.onload = function () {
      if (!permissions.includes('d')) {
        if (i.widht < 200 || i.height < 200) {
          callback('dimension-error');
          imgRef.current.src = '';
          return;
        }

        if (i.width !== i.height) {
          callback('dimension-error');
          imgRef.current.src = '';
          return;
        }
      }

      callback(reader.result);
    };

    i.src = reader.result;
  };

  reader.readAsDataURL(file);
}

export default processImg;
