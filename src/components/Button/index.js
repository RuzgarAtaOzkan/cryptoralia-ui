// MODULES
import cn from 'classnames';

// COMPONENTS
import Anchor from '../Anchor';

// STYLES
import styles from './Button.module.scss';

function Button({
  title = '',
  href = '#',
  target = '_blank',
  to = '',
  className = '',
  onClick = () => {},
  loading = false,
  disabled = false,
  primary,
  icon,
}) {
  if ((!href && !to) || title === null || title === undefined) {
    throw new Error('Too few arguments specified in Button');
  }

  return (
    <button
      className={cn(
        styles['button'],
        primary ? styles['primary'] : null,
        loading || disabled ? styles['disabled'] : null,
        className,
        href === '#' ? null : styles['pad-0']
      )}
      onClick={
        disabled
          ? function (e) {
              e.preventDefault();
            }
          : onClick
      }
    >
      {href === '#' ? (
        <>
          {title}
          {icon}
        </>
      ) : (
        <Anchor
          className={cn(
            primary ? styles['primary'] : null,
            className,
            'flx-ctr-ctr'
          )}
          href={href}
          target={target}
        >
          {title} <div className={'flx-ctr-ctr'}>{icon}</div>
        </Anchor>
      )}
    </button>
  );
}

export default Button;
