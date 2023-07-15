// MODULES
import React, { useState } from 'react';
import cn from 'classnames';

// COMPONETS
import NFT from '../../components/NFT';

// STYLES
import styles from './NFTs.module.scss';

function NFTsPage() {
  const [nfts, setNFTs] = useState([
    {
      name: 'Fall of the damned',
      username: 'pascalboyart',
      price: 1.2,
      img: '/assets/images/fall-of-the-damned.jpg',
      promoted: true,
    },
    {
      name: 'Fall of the damned',
      username: 'pascalboyart',
      price: 1.2,
      img: '/assets/images/fall-of-the-damned.jpg',
      promoted: true,
    },
    {
      name: 'Fall of the damned',
      username: 'pascalboyart',
      price: 1.2,
      img: '/assets/images/fall-of-the-damned.jpg',
    },
    {
      name: 'Fall of the damned',
      username: 'pascalboyart',
      price: 1.2,
      img: '/assets/images/fall-of-the-damned.jpg',
    },
    {
      name: 'Fall of the damned',
      username: 'pascalboyart',
      price: 1.2,
      img: '/assets/images/fall-of-the-damned.jpg',
    },

    {
      name: 'Fall of the damned',
      username: 'pascalboyart',
      price: 1.2,
      img: '/assets/images/fall-of-the-damned.jpg',
    },
  ]);

  return (
    <>
      <section className={cn(styles['nft-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['nfts'], 'flx-str-ctr')}>
          {nfts.map((current, index) => {
            return (
              <React.Fragment key={index}>
                <NFT data={current} />
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default NFTsPage;
