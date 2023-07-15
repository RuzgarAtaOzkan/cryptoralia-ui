// MODULES

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function Eye({ active, onClick }) {
  return active ? (
    <AiFillEyeInvisible onClick={onClick} />
  ) : (
    <AiFillEye onClick={onClick} />
  );
}

export default Eye;
