// MODULES
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import cn from 'classnames';

// PAGE COMPONENTS
import NotFound from '../404';

// COMPONENTS
import Anchor from '../../components/Anchor';

// ICONS
import LoadingCircleIcon from '../../components/Icons/LoadingCircle';
import SearchIcon from '../../components/Icons/Search';
import AngleDown from '../../components/Icons/AngleDown';

// UTILS
import makeUpper from '../../utils/makeUpper';
import removeSpaces from '../../utils/removeSpaces';
import getGuides from '../../utils/getGuides';
import shortenText from '../../utils/shortenText';

// STYLES
import styles from './Guide.module.scss';

function Guide({ data, guides }) {
  const [search, setSearch] = useState('');
  const [dropdownValue, setDropdownValue] = useState(
    data ? data.displayTitle : ''
  );
  const [searchIntervalId, setSearchIntervalId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [guide, setGuide] = useState(data ? data : {});
  const [dropdownGuides, setDropdownGuides] = useState(guides ? guides : []);

  return !data ? (
    <NotFound />
  ) : (
    <>
      <section className={cn(styles['guide-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['container'], 'flx-btw-str')}>
          <div className={cn(styles['search-area'])}>
            <div className={cn(styles['search-area-top'])}>
              <div className={cn(styles['search-input-area'], 'flx-btw-ctr')}>
                <input
                  type="text"
                  placeholder="Search Guide..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    clearTimeout(searchIntervalId);
                    const id = setTimeout(async () => {
                      let searchVal = removeSpaces(e.target.value);

                      if (!searchVal) {
                        setDropdownOpen(false);
                        setDropdownGuides(guides);
                        return;
                      }

                      setLoading(true);

                      const response = await getGuides(
                        '?limit=20&title=' + searchVal
                      );

                      setLoading(false);

                      if (!response) {
                        setDropdownOpen(false);
                        setDropdownGuides(guides);
                        return;
                      }

                      if (!response.data.length) {
                        setDropdownOpen(false);
                        setDropdownGuides([]);
                        return;
                      }

                      setDropdownOpen(true);
                      setDropdownGuides(response.data);
                    }, 300);

                    setSearchIntervalId(id);
                  }}
                />

                {loading ? (
                  <div
                    className={cn(styles['loading-circle-icon'], 'flx-ctr-ctr')}
                  >
                    <LoadingCircleIcon />
                  </div>
                ) : (
                  <SearchIcon />
                )}
              </div>
            </div>
            <div className={cn(styles['search-area-bottom'])}>
              {dropdownGuides.map((current, index) => {
                return (
                  <Anchor
                    key={index}
                    href={'/guide/' + current.title.replace(/\s/g, '-')}
                    className={cn(styles['search-item'], 'flx-btw-ctr')}
                  >
                    <div className={cn(styles['search-item-title'])}>
                      {shortenText(current.displayTitle, 28)}
                    </div>
                    <div className={cn(styles['search-item-category'])}>
                      {current.category}
                    </div>
                  </Anchor>
                );
              })}
            </div>
          </div>

          <div className={cn(styles['guides-dropdown'])}>
            <div
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
              }}
              className={cn(styles['dropdown-bar'], 'flx-btw-ctr')}
            >
              <div className={cn(styles['dropdown-value'])}>
                {dropdownValue}
              </div>

              <AngleDown />
            </div>

            <div
              className={cn(
                styles['dropdown-menu'],
                dropdownOpen ? styles['dropdown-menu-active'] : null
              )}
            >
              {dropdownGuides.map((current, index) => {
                return (
                  <Anchor
                    href={'/guide/' + current.title.replace(/\s/g, '-')}
                    key={index}
                    className={cn(styles[''])}
                  >
                    {current.displayTitle}
                  </Anchor>
                );
              })}
            </div>
          </div>

          <div className={cn(styles['guide-area'])}>
            <div className={cn(styles['guide-title'], 'flx-btw-ctr')}>
              <h1>{guide.displayTitle}</h1>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: guide.content }}
              className={cn(styles['guide-content'])}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Guide;
