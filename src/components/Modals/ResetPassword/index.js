// MODULES
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

// CONFIG
import config from '../../../config';

// CONTEXT
import { useStore } from '../../../context';
import gdt from '../../../context/global/types';

// ICONS
import CloseIcon from '../../Icons/Close';

// COMPONENTS
import Button from '../../Button';
import Input from '../../Input';

// UTILS
import reqInstance from '../../../utils/axios';

// STYLES
import styles from './ResetPassword.module.scss';

function ResetPassword({ active }) {
  const store = useStore();
  const router = useRouter();
  const [inputTypes] = useState(['password', 'text', 'email']);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerification, setPassworVerification] = useState('');
  const [passwordInputType, setPasswordInputType] = useState('password');

  async function resetPassword(body) {
    if (!body) {
      throw new Error('Too few arguments specified in changePassword');
    }

    setLoading(true);

    const domain = config.api.domain;
    const apiVersion = config.api.version;
    const token = router.query.token;
    const endpoint = '/v' + apiVersion + '/reset-password/' + token;
    const url = domain + endpoint;

    try {
      const response = await reqInstance.post(url, body);

      store.dispatchGlobal({
        type: gdt.SET_ALERT,
        payload: {
          message: 'Password has been reset',
          type: 'success',
        },
      });

      store.dispatchGlobal({
        type: gdt.SET_RESET_PASSWORD_MODAL,
        payload: false,
      });

      setTimeout(() => {
        store.dispatchGlobal({ type: gdt.CLEAR_ALERTS });
        router.push('/');
      }, 1000);

      return response;
    } catch (error) {
      setLoading(false);

      console.log(error);

      if (error.response) {
        if (error.response.data) {
          const errors = error.response.data;

          for (let i = 0; i < errors.length; i++) {
            const title = errors[i].description;

            store.dispatchGlobal({
              type: gdt.SET_ALERT,
              payload: {
                message: title,
                type: 'error',
              },
            });
          }
        }
      } else {
        store.dispatchGlobal({
          type: gdt.SET_ALERT,
          payload: {
            message: 'Something went wrong',
            type: 'error',
          },
        });
      }
    }
  }

  function closeModal() {
    store.dispatchGlobal({
      type: gdt.SET_RESET_PASSWORD_MODAL,
      payload: false,
    });
  }

  return active ? (
    <section className={cn(styles['container'])}>
      <div onClick={() => closeModal()} className={cn(styles['background'], 'trnstn')} />

      <div className={cn(styles['modal'], 'trnstn')}>
        <div className={cn(styles['title-area'], 'flx-btw-ctr', 'trnstn')}>
          <div className={cn(styles['title'])}>Change password</div>
        </div>

        <div className={cn(styles['subtitle'], 'trnstn')}>To ensure your account is well protected, please use 8 or more characters.</div>

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>New password</label>
          </div>
          <Input placeholder="New password..." type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        </div>

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>New password again</label>
          </div>
          <Input placeholder="New password again..." type="password" value={passwordVerification} onChange={(e) => setPassworVerification(e.target.value)} fullWidth />
        </div>

        <Button
          className={cn(styles['button'])}
          title="Change password"
          disabled={loading}
          onClick={(e) => {
            if (loading) {
              e.preventDefault();
              return;
            }

            resetPassword({
              password,
              passwordVerification,
            });
          }}
          primary
        />
      </div>
    </section>
  ) : null;
}

export default ResetPassword;
