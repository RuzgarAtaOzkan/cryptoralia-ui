// MODULES
import cn from 'classnames';

// COMPONENTS
import Anchor from '../../Anchor';

// STYLES
import styles from './Dropdown.module.scss';

function ProfileDropdown({ active, data }) {
  return active ? (
    <div className={cn(styles['container'])}>
      {data.map((current, index) => {
        const { onClick, type, title, href } = current;

        return type === 'seperator' ? (
          <div key={index} className={cn(styles['seperator'])} />
        ) : (
          <div
            onClick={onClick ? onClick : () => {}}
            key={index}
            className={cn(styles['item'])}
          >
            <Anchor content={title} href={href} />
          </div>
        );
      })}
    </div>
  ) : null;
}

export default ProfileDropdown;
