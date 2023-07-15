import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

function Star({ active }) {
  return active ? <AiFillStar /> : <AiOutlineStar />;
}

export default Star;
