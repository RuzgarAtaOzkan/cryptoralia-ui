// MODULES

import { IoIosSearch } from 'react-icons/io';

function SearchIcon({ active, onClick, className }) {
  return <IoIosSearch onClick={onClick} className={className} />;
}

export default SearchIcon;
