// MODULES
import React from 'react';
import cn from 'classnames';

// COMPONENTS
import Button from '../../components/Button';

// STYLES
import styles from './NotFound.module.scss';

function NotFound({
  href = '/',
  title = 'Go Home',
  desc = 'Ooops!!! The page you are looking for is not here.',
}) {
  return (
    <>
      <section className={cn(styles['not-found-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['not-found'])}>
          <div className={cn(styles['title'])}>
            <h1>404</h1> Not Found
          </div>

          <div className={cn(styles['desc'])}>{desc}</div>

          <Button primary title={title} href={href} target="_self" />
        </div>
      </section>
    </>
  );
}

export default NotFound;
