// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// STYLES
import styles from './Input.module.scss';

function Input({
  value = '',
  onChange = () => {},
  onPaste = () => {},
  placeholder = '',
  type = 'text',
  className = '',
  fullWidth,
  autoComplete = 'false',
}) {
  return (
    <input
      className={cn(
        styles['input'],
        fullWidth ? styles['full-width'] : null,
        'trnstn',
        className
      )}
      value={value}
      autoComplete={autoComplete || 'false'}
      onChange={onChange}
      onPaste={onPaste}
      placeholder={placeholder}
      type={type}
    />
  );
}

export default Input;
