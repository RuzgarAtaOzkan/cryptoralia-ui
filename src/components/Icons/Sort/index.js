// MODULES
import React from 'react';
import { FaSortAmountDownAlt, FaSortAmountDown } from 'react-icons/fa';

function Sort({ active }) {
  return active ? <FaSortAmountDownAlt /> : <FaSortAmountDown />;
}

export default Sort;
