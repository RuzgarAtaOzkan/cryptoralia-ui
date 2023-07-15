// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// COMPONENTS

import Anchor from '../../components/Anchor';
import Button from '../../components/Button';
import MyTable from '../../components/MyTable';

// COMPONENTS > ICONS
import PlusIcon from '../../components/Icons/Plus';
import PencilIcon from '../../components/Icons/Pencil';
import GraphIcon from '../../components/Icons/Graph';

// STYLES
import styles from './MyNFTs.module.scss';

function MyNFTsPage() {
  const [rows, setRows] = useState([
    {
      id: '1',
      name: 'Pascal Boyart',
      status: 2,
      editHref: '/edit-nft',
    },
    {
      id: '2',
      name: 'Fall of the Damned',
      status: 0,
      editHref: '/edit-nft',
    },
    {
      id: '3',
      name: 'Monkey',
      status: 1,
      editHref: '/edit-nft',
    },
  ]);

  return (
    <>
      <section className={cn('ads-section', 'flx-ctr-ctr')}>
        {
          //  <Ads />
        }
      </section>
      <section className={cn(styles['my-nfts-section'], 'flx-ctr-str')}>
        <div className={cn(styles['my-nfts'])}>
          <div className={cn(styles['title-area'], 'flx-str-ctr', 'trnstn')}>
            <h1>My NFTs</h1>
            <Anchor href="/add-nft">
              <div className={cn(styles['add-btn'], 'flx-ctr-ctr')}>
                <div className={cn(styles['icon-container'], 'flx-ctr-ctr')}>
                  <PlusIcon />
                </div>
                Add
              </div>
            </Anchor>
          </div>

          <MyTable rows={rows} />
        </div>
      </section>
    </>
  );
}

export default MyNFTsPage;
