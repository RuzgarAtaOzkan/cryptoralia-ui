// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// COMPONENTS
import Anchor from '../../components/Anchor';

// ICONS
import LoadingCircleIcon from '../../components/Icons/LoadingCircle';
import SearchIcon from '../../components/Icons/Search';
import AngleDownIcon from '../../components/Icons/AngleDown';
import AngleUpIcon from '../../components/Icons/AngleUp';

// UTILS
import makeUpper from '../../utils/makeUpper';
import getGuides from '../../utils/getGuides';
import removeSpaces from '../../utils/removeSpaces';

// STYLES
import styles from './Guides.module.scss';

function createGuideColumns(guides) {
  const first = [];
  const second = [];
  const third = [];
  const fourth = [];

  let index = 0;
  for (let i = 0; i < guides.length; i++) {
    switch (index) {
      case 0:
        first.push(guides[i]);
        break;

      case 1:
        second.push(guides[i]);
        break;

      case 2:
        third.push(guides[i]);
        break;

      case 3:
        fourth.push(guides[i]);
        break;

      default:
        break;
    }

    if (index >= 3) {
      index = 0;
    } else {
      index++;
    }
  }

  return [first, second, third, fourth];
}

function seperateCategories(guides) {
  if (!guides) {
    return null;
  }

  const categories = [];

  for (let i = 0; i < guides.length; i++) {
    if (!categories.includes(guides[i].category)) {
      categories.push(guides[i].category);
    }
  }

  return categories;
}

function Guides({ data = [] }) {
  const [categories, setCategories] = useState(seperateCategories(data) || []);
  const [categoriesLoadedMore, setCategoriesLoadedMore] = useState([]);
  const [searchTimeoutId, setSearchTimeoutId] = useState(0);
  const [guides, setGuides] = useState(data || []);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <>
      <section className={cn(styles['guide-section'], 'flx-ctr-str')}>
        <div className={cn(styles['container'])}>
          <div className={cn(styles['guide-title'], 'flx-btw-ctr')}>
            <h1>Guide</h1>

            <div className={cn(styles['search-area'], 'flx-btw-ctr')}>
              <input
                value={search}
                onChange={async (e) => {
                  const value = removeSpaces(e.target.value);

                  if (!value) {
                    return;
                  }

                  setSearch(value);

                  clearTimeout(searchTimeoutId);

                  const id = setTimeout(async () => {
                    setLoading(true);

                    const response = await getGuides(
                      '?limit=20&title=' + value
                    );

                    setLoading(false);

                    if (!response) {
                      return;
                    }

                    const data = response.data;
                    setGuides(data);
                    setCategories(seperateCategories(data));
                    setCategoriesLoadedMore([]);

                    for (let i = 0; i < data.length; i++) {
                      if (!categoriesLoadedMore.includes(data[i].category)) {
                        setCategoriesLoadedMore(data[i].category);
                      }
                    }
                  }, 300);

                  setSearchTimeoutId(id);
                }}
                placeholder="Search Guides..."
                type="text"
              />

              <div
                className={cn(
                  'flx-ctr-ctr',
                  styles['search-icon'],
                  loading ? styles['search-icon-spin'] : null
                )}
              >
                {loading ? <LoadingCircleIcon /> : <SearchIcon />}
              </div>
            </div>
          </div>

          {categories.map((category, i) => {
            const categoryTitle = categories[i];
            const guideColumns = createGuideColumns(
              guides.filter((current) => current.category === categoryTitle)
            );

            return (
              <div key={i} className={cn(styles['guide-category'])}>
                <div className={cn(styles['category-title'])}>
                  {makeUpper(categoryTitle, 'g')}
                </div>

                <div className={cn(styles['category-content'], 'flx-btw-str')}>
                  <div className={cn(styles['column'])}>
                    {guideColumns[0].map((column, j) => {
                      if (
                        j >= 3 &&
                        !categoriesLoadedMore.includes(categoryTitle)
                      ) {
                        return;
                      }

                      return (
                        <Anchor
                          key={j}
                          href={'/guide/' + column.title.replace(/\s/g, '-')}
                        >
                          {column.displayTitle}
                        </Anchor>
                      );
                    })}
                  </div>

                  <div className={cn(styles['column'])}>
                    {guideColumns[1].map((column, j) => {
                      if (
                        j >= 3 &&
                        !categoriesLoadedMore.includes(categoryTitle)
                      ) {
                        return;
                      }

                      return (
                        <Anchor
                          key={j}
                          href={'/guide/' + column.title.replace(/\s/g, '-')}
                        >
                          {column.displayTitle}
                        </Anchor>
                      );
                    })}
                  </div>

                  <div className={cn(styles['column'])}>
                    {guideColumns[2].map((column, j) => {
                      if (
                        j >= 3 &&
                        !categoriesLoadedMore.includes(categoryTitle)
                      ) {
                        return;
                      }

                      return (
                        <Anchor
                          key={j}
                          href={'/guide/' + column.title.replace(/\s/g, '-')}
                        >
                          {column.displayTitle}
                        </Anchor>
                      );
                    })}
                  </div>

                  <div className={cn(styles['column'])}>
                    {guideColumns[3].map((column, j) => {
                      if (
                        j >= 3 &&
                        !categoriesLoadedMore.includes(categoryTitle)
                      ) {
                        return;
                      }

                      return (
                        <Anchor
                          key={j}
                          href={'/guide/' + column.title.replace(/\s/g, '-')}
                        >
                          {column.displayTitle}
                        </Anchor>
                      );
                    })}
                  </div>
                </div>

                {guideColumns[0].length +
                  guideColumns[1].length +
                  guideColumns[2].length +
                  guideColumns[3].length >
                12 ? (
                  <div className={cn(styles['load-more-area'], 'flx-ctr-ctr')}>
                    <div
                      onClick={() => {
                        if (!categoriesLoadedMore.includes(categoryTitle)) {
                          setCategoriesLoadedMore([
                            ...categoriesLoadedMore,
                            categoryTitle,
                          ]);

                          return;
                        }

                        setCategoriesLoadedMore(
                          categoriesLoadedMore.filter(
                            (current) => current !== categoryTitle
                          )
                        );
                      }}
                      className={cn(styles['load-more-btn'], 'flx-ctr-ctr')}
                    >
                      {categoriesLoadedMore.includes(categoryTitle)
                        ? 'Hide'
                        : 'Load more'}
                      {categoriesLoadedMore.includes(categoryTitle) ? (
                        <AngleUpIcon />
                      ) : (
                        <AngleDownIcon />
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Guides;
