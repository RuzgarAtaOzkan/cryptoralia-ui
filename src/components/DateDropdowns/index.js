// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// COMPONENTS
import Dropdown from '../Dropdown';

// STYLES
import styles from './DateDropdowns.module.scss';

function DateDropdowns({
  data = {
    day: 1,
    month: 1,
    year: new Date().getFullYear(),
  },
  setData = () => {},
  period = 'all',
  disabled = false,
}) {
  const periods = ['all', 'past', 'future'];
  const date = new Date();

  // For getting every months day count.
  // monthDays[new Date().getMonth()]
  const monthDays = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31,
  };

  const [days, setDays] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ]);
  const [months, setMonths] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const _years = [];
    const _months = [];
    const _days = [];

    // id period is ALL.
    if (period === periods[0]) {
      for (let i = 0; i < 15; i++) {
        _years[i] = 2018 + i;
      }

      setYears(_years);

      setData({
        ...data,
        day: date.getDate(),
        month: date.getMonth() + 1,
      });
    }

    // If period is PAST
    if (period === periods[1]) {
      for (let i = 0; i < 15; i++) {
        _years[i] = date.getFullYear() - i;
      }

      for (let i = 0; i < date.getMonth() + 1; i++) {
        _months[i] = i + 1;
      }

      for (let i = 0; i < date.getDate(); i++) {
        _days[i] = i + 1;
      }

      setYears(_years);
      setMonths(_months);
      setDays(_days);

      setData({
        ...data,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
    }

    // If period is FUTURE
    if (period === periods[2]) {
      for (let i = 0; i < 15; i++) {
        _years[i] = date.getFullYear() + i;
      }

      for (let i = 0; i < 12; i++) {
        if (date.getMonth() + i + 1 <= 12) {
          _months[i] = date.getMonth() + i + 1;
        }
      }

      for (let i = 0; i <= monthDays[date.getMonth()]; i++) {
        if (date.getDate() + i <= monthDays[date.getMonth()]) {
          _days[i] = date.getDate() + i;
        }
      }

      setDays(_days);
      setMonths(_months);
      setYears(_years);

      setData({
        ...data,
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });
    }
  }, [period]);

  return (
    <div className={cn(styles['container'], 'flx-str-ctr')}>
      <div className={cn(styles['date-input-area'])}>
        <div>Days</div>
        <Dropdown
          data={days}
          setValue={(value) => {
            setData({ ...data, day: value });
          }}
          value={data.day}
          disabled={disabled}
        />
      </div>

      <div className={cn(styles['date-input-area'])}>
        <div>Months</div>
        <Dropdown
          data={months}
          setValue={(value) => {
            const newDays = [];

            if (period === periods[0]) {
              for (let i = 0; i < monthDays[value - 1]; i++) {
                newDays[i] = i + 1;
              }

              setDays(newDays);

              setData({ ...data, month: value });
            }

            if (period === periods[1]) {
              if (
                data.year === date.getFullYear() &&
                value === date.getMonth() + 1
              ) {
                for (let i = 0; i < days.length; i++) {
                  if (days[i] <= date.getDate()) {
                    newDays.push(days[i]);
                  }
                }

                setDays(newDays);
                setData({ ...data, day: date.getDate(), month: value });
              } else {
                for (let i = 0; i < monthDays[value - 1]; i++) {
                  newDays[i] = i + 1;
                }

                setDays(newDays);
                setData({ ...data, month: value });
              }
            }

            if (period === periods[2]) {
              if (
                data.year === date.getFullYear() &&
                value === date.getMonth() + 1
              ) {
                for (let i = 0; i < days.length; i++) {
                  if (days[i] >= date.getDate()) {
                    newDays.push(days[i]);
                  }
                }

                setDays(newDays);
                setData({ ...data, day: date.getDate(), month: value });
              } else {
                for (let i = 0; i < monthDays[value - 1]; i++) {
                  newDays[i] = i + 1;
                }

                setDays(newDays);
                setData({ ...data, month: value });
              }
            }
          }}
          value={data.month}
          disabled={disabled}
        />
      </div>
      <div className={cn(styles['date-input-area'])}>
        <div>Years</div>
        <Dropdown
          data={years}
          setValue={(value) => {
            const newMonths = [];
            const newDays = [];

            if (period === periods[0]) {
              setData({ ...data, year: value });
            }

            if (period === periods[1]) {
              if (value === date.getFullYear()) {
                for (let i = 0; i < months.length; i++) {
                  if (months[i] <= date.getMonth() + 1) {
                    newMonths.push(months[i]);
                  }
                }

                for (let i = 0; i < monthDays[date.getMonth()]; i++) {
                  if (i + 1 <= date.getDate()) {
                    newDays[i] = i + 1;
                  }
                }

                setMonths(newMonths);
                setDays(newDays);
                setData({
                  ...data,
                  day: date.getDate(),
                  month: date.getMonth() + 1,
                  year: value,
                });
              } else {
                for (let i = 0; i < 12; i++) {
                  newMonths[i] = i + 1;
                }

                for (let i = 0; i < monthDays[data.month - 1]; i++) {
                  newDays[i] = i + 1;
                }

                setDays(newDays);
                setMonths(newMonths);
                setData({ ...data, year: value });
              }

              if (
                value === date.getFullYear() &&
                data.month === date.getMonth() + 1
              ) {
                for (let i = 0; i < monthDays[date.getMonth()]; i++) {
                  if (i + 1 <= date.getDate()) {
                    newDays[i] = i + 1;
                  }
                }

                setDays(newDays);
              }
            }

            if (period === periods[2]) {
              if (
                value === date.getFullYear() &&
                data.month === date.getMonth() + 1
              ) {
                for (let i = 0; i < monthDays[date.getMonth()]; i++) {
                  if (i + 1 >= date.getDate()) {
                    newDays[i] = i + 1;
                  }
                }

                setDays(newDays);
              }

              if (value === date.getFullYear()) {
                for (let i = 0; i < months.length; i++) {
                  if (months[i] >= date.getMonth() + 1) {
                    newMonths.push(months[i]);
                  }
                }

                for (let i = 0; i < monthDays[data.month - 1]; i++) {
                  if (i + 1 >= date.getDate()) {
                    newDays[i] = i + 1;
                  }
                }

                setDays(newDays);
                setMonths(newMonths);
                setDays(newDays);
                setData({
                  ...data,
                  day: date.getDate(),
                  month: date.getMonth() + 1,
                  year: value,
                });
              } else {
                for (let i = 0; i < 12; i++) {
                  newMonths[i] = i + 1;
                }

                for (let i = 0; i < monthDays[data.month - 1]; i++) {
                  newDays[i] = i + 1;
                }

                setDays(newDays);
                setMonths(newMonths);
                setData({ ...data, year: value });
              }
            }
          }}
          value={data.year}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default DateDropdowns;
