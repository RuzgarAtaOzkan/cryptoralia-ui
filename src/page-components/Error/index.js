// MODULES
import React from 'react';
import cn from 'classnames';

// COMPONENTS
import Button from '../../components/Button';

// STYLES
import styles from './404.module.scss';

function Page404({
  href = '/',
  title = 'Go Home',
  desc = "Ooops!!! The page you are looking for doesn't exists",
}) {
  return (
    <>
      <section className={cn(styles['error-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['error'])}>
          <div className={cn(styles['title'], 'flx-str-ctr')}>
            <h1>404</h1> <div className={cn(styles['subtitle'])}>Not Found</div>
          </div>

          <div className={cn(styles['desc'])}>{desc}</div>
          <Button primary title={title} href={href} target="_self" />
        </div>
      </section>
    </>
  );
}

export default Page404;
