// MODULES
import cn from 'classnames';

// COMPONENTS
import Anchor from '../Anchor';
import PencilIcon from '../Icons/Pencil';
import GraphIcon from '../Icons/Graph';

// STYLES
import styles from './MyTable.module.scss';

function MyTable({ data = [], type = 'token' }) {
  const statuses = {
    0: 'Pending for approval',
    1: 'Rejected',
    2: 'Active',
  };

  function setHref(current) {
    switch (type) {
      case 'airdrop':
        return current.link;

      default:
        return current.name.replace(/\s/g, '-');
    }
  }

  return (
    <div className={cn(styles['container'])}>
      <div className={cn(styles['table'])}>
        <div className={cn(styles['titles'], 'flx-btw-ctr')}>
          <div className={cn(styles['name'])}>Token</div>
          <div className={cn(styles['actions'], 'flx-ctr-ctr')}>Actions</div>
          <div className={cn(styles['status'], 'flx-ctr-ctr')}>Status</div>
        </div>

        <div className={cn(styles['rows'], 'flx-btw-ctr-clm')}>
          {data.map((current, index) => {
            return (
              <div key={index} className={cn(styles['row'], 'flx-btw-ctr')}>
                <div className={cn(styles['name-edit'], 'flx-str-ctr')}>
                  <Anchor
                    href={setHref(current)}
                    className={cn(styles['name'])}
                  >
                    {type === 'airdrop' ? current.name : current.displayName}
                  </Anchor>

                  {type === 'airdrop' ? null : (
                    <Anchor
                      href={`/edit-token/${current.name.replace(/\s/g, '-')}`}
                      className={cn(styles['edit-icon'], 'flx-ctr-ctr')}
                    >
                      <PencilIcon />
                    </Anchor>
                  )}
                </div>
                <div className={cn(styles['actions'], 'flx-ctr-ctr')}>
                  <Anchor
                    href="/promote"
                    className={cn(styles['promote-btn'], 'flx-str-ctr')}
                  >
                    <div
                      className={cn(styles['promote-icon-area'], 'flx-ctr-ctr')}
                    >
                      <GraphIcon />
                    </div>

                    <div className={cn(styles['promote-title'])}>Promote</div>
                  </Anchor>
                </div>

                <div
                  className={cn(
                    styles['status'],
                    'flx-ctr-ctr',
                    current.status === 0 ||
                      (current.editData && current.status !== 1)
                      ? styles['grey']
                      : null,
                    current.status === 1 ? styles['red'] : null,
                    current.status === 2 && !current.editData
                      ? styles['green']
                      : null
                  )}
                >
                  {current.editData && current.status === 2
                    ? 'Waiting for edit approval'
                    : statuses[current.status]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyTable;
