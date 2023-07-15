// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// CONTEXT
import { useStore } from '../../context';

// COMPONENTS
import Button from '../../components/Button';
import Table from '../../components/Table';

// UTILS
import makeUpper from '../../utils/makeUpper';
import displayDate from '../../utils/displayDate';

// STYLES
import styles from './Promote.module.scss';

function PromotePage() {
  const prices = {
    'banner-ads': 150,
    token: 100,
    nft: 30,
  };

  const [date, setDate] = useState('');
  const [type, setType] = useState('banner-ads');
  const [addPromotionButtonPrimary, setAddPromotionButtonPrimary] = useState(false);
  const [promotions, setPromotions] = useState([]);

  function addPromotion() {
    if (date[0] && date[1]) {
      let extraction = date[1].valueOf() - date[0].valueOf();

      if (extraction < 0) {
        extraction = extraction * -1;
      }

      const dayInMilliseconds = 1000 * 60 * 60 * 24 - 1;
      const days = parseInt(extraction / dayInMilliseconds);
      const start = displayDate(date[0].toString());
      const end = displayDate(date[1].toString());
      const price = prices[type] * days;

      setPromotions([
        ...promotions,
        {
          start,
          end,
          price,
          type: makeUpper(type),
        },
      ]);

      setType('banner-ads');
      setDate('');
    }
  }

  useEffect(() => {
    if (date) {
      if (date[0] && date[1]) {
        setAddPromotionButtonPrimary(true);
      } else {
        setAddPromotionButtonPrimary(false);
      }
    }
  }, [date]);

  return (
    <>
      <section className={cn(styles['promote-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['promote-area'], 'flx-btw-str')}>
          <div className={cn(styles['promote-area-left'])}>
            <div className={cn(styles['promote-order'])}>1</div>
            <div className={cn(styles['promote-title'])}>Select Promotion Type</div>

            <div className={cn(styles['promote-desc'])}>
              You can select your promotion type here. <br />
              Banner Ads or Token promotion etc.
            </div>

            <div className={cn(styles['promote-types'], 'flx-ctr-ctr-clm')}>
              <Button title={<div>Header Banner Ads &nbsp; - &nbsp; $75 / day</div>} primary={type === 'banner-ads' ? true : false} onClick={() => setType('banner-ads')} />
              <Button title={<div>Featured Token &nbsp; - &nbsp; $30 / day</div>} primary={type === 'token' ? true : false} onClick={() => setType('token')} />
            </div>
          </div>

          <div className={cn(styles['promote-area-mid'])}>
            <div className={cn(styles['promote-order'])}>2</div>
            <div className={cn(styles['date-title'])}>Select Date</div>

            <div className={cn(styles['date-desc'])}>Now select your date here. From start to End.</div>

            <div className={cn(styles['calendar-area'], 'flx-ctr-ctr')}>
              <Calendar onChange={setDate} value={date} selectRange={true} minDate={new Date()} />
            </div>

            <div className={cn(styles['add-btn-area'], 'flx-ctr-ctr')}>
              <Button
                onClick={() => {
                  addPromotion();
                }}
                primary={addPromotionButtonPrimary}
                title="Add Promotion"
              />
            </div>
          </div>

          <div className={cn(styles['promote-area-right'])}>
            <div className={cn(styles['promote-order'])}>3</div>
            <div className={cn(styles['result-title'])}>Result</div>
            <div className={cn(styles['result-desc'])}>You can see the final results here.</div>

            <div className={cn(styles['selected-promotions-table-area'], 'flx-str-ctr')}>
              <div className={cn(styles['selected-promotions-table'])}>
                <div className={cn(styles['titles'], 'flx-btw-str')}>
                  <div className={cn(styles['order'])}>#</div>
                  <div className={cn(styles['date'])}>
                    Date
                    <div>(From & To)</div>
                  </div>
                  <div className={cn(styles['type'])}>Type</div>
                  <div className={cn(styles['price'])}>Price</div>
                </div>
                {promotions.map((current, index) => {
                  return (
                    <div key={index + 1} className={cn(styles['rows'], 'flx-btw-str')}>
                      <div className={cn(styles['order'])}>{index + 1}</div>
                      <div className={cn(styles['date'])}>
                        <div className={cn(styles['date-from'])}>{current.start}</div>

                        <div className={cn(styles['date-to'])}>{current.end}</div>
                      </div>
                      <div className={cn(styles['type'])}>{current.type}</div>
                      <div className={cn(styles['price'])}>{current.price}$</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={cn(styles['telegram-btn-area'], 'flx-ctr-ctr')}>
              <Button href="#" title="Go to Telegram" primary />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PromotePage;
