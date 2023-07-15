// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';
import globalDispatchTypes from '../../context/global/types';

// COMPONENTS
import Anchor from '../../components/Anchor';
import Button from '../../components/Button';

// ICONS
import EyeIcon from '../../components/Icons/Eye';

// PAGE COMPONENTS
import LoadingPage from '../Loading';

// STYLES
import styles from './Blog.module.scss';

function BlogPage({ data = [] }) {
  const store = useStore();
  const [blogs, setBlogs] = useState(data);

  useEffect(() => {
    if (data) {
      const fakeBlogs = [
        {
          title: 'Top 10 Web3 Coins',
          category: 'Web3',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rhoncus, velit id elementum laoreet, lacus sem eleifend turpis, at scelerisque est risus sit amet lorem. Mauris ',
          imgURL: '/assets/images/cryptoralia_covered.png',
          visits: 343,
        },
      ];

      setBlogs(fakeBlogs);
    }
  }, [data]);

  return (
    <>
      <section className={cn(styles['blog-section'], 'flx-ctr-ctr')}>
        <h1>Blog</h1>

        <div className={cn(styles['posts'], 'flx-ctr-ctr')}>
          {blogs.map((current, index) => {
            return (
              <div key={index} className={cn(styles['post'])}>
                <h2>{current.title}</h2>

                <div className={cn(styles['info-area'], 'flx-btw-ctr')}>
                  <div className={cn(styles['category-visits'], 'flx-str-ctr')}>
                    <div className={cn(styles['category'])}>Category: {current.category}</div>

                    <div className={cn(styles['visits'], 'flx-ctr-ctr')}>
                      <EyeIcon /> {current.visits.toString()}
                    </div>
                  </div>

                  <div className={cn(styles['date'])}>13 May 2022</div>
                </div>

                <Anchor className={cn(styles['img-container'])} href={current.href}>
                  <img src={current.imgURL} title={current.title} alt={current.title} />
                </Anchor>

                <p>{current.subtitle}</p>

                <Button className={cn(styles['read-more'])} primary title="READ MORE" href={`/blog`} />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default BlogPage;
