// MODULES
import Image from 'next/image';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../Anchor';

// STYLES
import styles from './TrendBox.module.scss';

function TrendBox({ data = [], title = '', icon = '', iconColor = '', href = '/trending' }) {
  function displayChange24h(change24h) {
    if (change24h === undefined || change24h === null) {
      return <div className={cn(styles['grey'])}>-</div>;
    }

    if (Number(change24h) === 0) {
      return <div className={cn(styles['grey'])}>0.00%</div>;
    }

    return <div className={cn(Number(change24h) > 0 ? styles['green'] : styles['red'])}>{Number(change24h) + '%'}</div>;
  }

  return (
    <div className={cn(styles['container'])}>
      <div className={cn(styles['top'], 'flx-btw-ctr')}>
        <div className={cn(styles['icon'], styles[iconColor], 'flx-ctr-ctr')}>
          {icon}
          <span>{title}</span>
        </div>

        <div className={cn(styles['more'])}>
          <Anchor href={href}>{'More >'}</Anchor>
        </div>
      </div>

      <div className={cn(styles['bottom'])}>
        {data
          ? data.map((current, index) => {
              if (!current) {
                return null;
              }

              if (!current.displayName) {
                return null;
              }

              return (
                <Anchor key={index} href={`/${current.name.replace(/\s/g, '-')}`} className="flx-btw-ctr">
                  <div className={cn(styles['left'], 'flx-ctr-ctr')}>
                    <div className={styles['order']}>{index + 1}</div>
                    <div className={cn(styles['img-container'], 'flx-ctr-ctr')}>
                      <Image alt={current.name.replace(/\s/g, '-') + '-logo'} src={current.imgURL} width="35" height="35" />
                    </div>
                    <div className={cn(styles['name-symbol'])}>
                      <div className={cn(styles['symbol'], 'flx-str-ctr')}>
                        {current.symbol}
                        {current.verified ? <img src="/assets/images/cryptoralia-verified.png" alt="cryptoralia-verified" title="Verified" /> : null}
                      </div>
                      <div className={cn(styles['name'])}>{current.displayName}</div>
                    </div>
                  </div>
                  <div className={cn(styles['right'])}>{displayChange24h(current.change24h)}</div>
                </Anchor>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default TrendBox;
