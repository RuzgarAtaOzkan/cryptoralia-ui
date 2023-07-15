// MODULES
import React, { useState, useEffect } from 'react';
import cn from 'classnames';

// CONFIG
import config from '../../config';

// CONTEXT
import { useStore } from '../../context';
import gdt from '../../context/global/types';

// COMPONENTS
import Anchor from '../Anchor';
import CloseIcon from '../Icons/Close';
import CheckCircleIcon from '../Icons/CheckCircle';
import InfoIcon from '../Icons/Info';
import WarningIcon from '../Icons/Warning';

// STYLES
import styles from './Toaster.module.scss';

function Toaster({ data }) {
  const store = useStore();
  const types = { error: 'error', success: 'success', info: 'info' };

  const [messages, setMessages] = useState(data);
  const [fadeOutTimer, setFadeOutTimer] = useState(0);
  const [deleteTimer, setDeleteTimer] = useState(0);

  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      if (!data[i].id) {
        data[i].id = i + 1;
      }
    }

    const reversed = [];

    let j = 0;
    for (let i = data.length - 1; i > -1; i--) {
      reversed[j] = data[i];
      j = j + 1;
    }

    setMessages(data);
  }, [data]);

  // FADE ALL ALERTS OUT
  useEffect(() => {
    clearTimeout(fadeOutTimer);

    const timer = setTimeout(() => {
      const newMessages = [...data];

      for (let i = 0; i < data.length; i++) {
        newMessages[i].className = 'fade';
      }

      setMessages(newMessages);
    }, config.times.alert);

    setFadeOutTimer(timer);
  }, [data]);

  // CLEAR ALL THE ALERTS
  useEffect(() => {
    if (!store.global.alerts.length) {
      return;
    }

    clearTimeout(deleteTimer);

    const timer = setTimeout(() => {
      store.dispatchGlobal({ type: gdt.CLEAR_ALERTS });
    }, config.times.alert / 4 + config.times.alert);

    setDeleteTimer(timer);
  }, [data]);

  return (
    <section className={cn(styles['toaster-section'])}>
      <div className={cn(styles['alerts'])}>
        {messages.map((current, index) => {
          return (
            <div
              key={current.id}
              className={cn(styles['alert'], 'flx-btw-ctr', index >= 3 ? styles['pos-abs'] : null, current.className ? styles[current.className] : null, current.type === types.error ? styles['error'] : null, current.type === types.success ? styles['success'] : null, current.type === types.info ? styles['info'] : null)}
              onClick={() => {
                const alerts = [];
                for (let i = 0; i < store.global.alerts.length; i++) {
                  if (current.id !== store.global.alerts[i].id) {
                    alerts.push(store.global.alerts[i]);
                  }
                }

                store.dispatchGlobal({
                  type: gdt.SET_ALERTS,
                  payload: alerts,
                });
              }}
            >
              <div className={cn(styles['type'], current.type === 'error' ? styles['typeerror'] : null, current.type === 'success' ? styles['typesuccess'] : null, current.type === 'info' ? styles['typeinfo'] : null, 'flx-ctr-ctr')}>
                {current.type === 'error' ? <WarningIcon /> : null}
                {current.type === 'success' ? <CheckCircleIcon /> : null}
                {current.type === 'info' ? <InfoIcon /> : null}
              </div>
              <div className={cn(styles['message'])}>
                {current.link ? (
                  <Anchor href={current.link} target="_blank">
                    {current.message}
                  </Anchor>
                ) : (
                  current.message
                )}
              </div>
              <div className={cn(styles['id'])}># {current.id}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Toaster;
