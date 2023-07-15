// MODULES
import { useState, useEffect } from 'react';
import cn from 'classnames';

// API
import Request from '../../../api/request';

// CONFIG
import config from '../../../config';

// CONTEXT
import { useStore } from '../../../context';
import authDispatchTypes from '../../../context/auth/types';
import globalDispatchTypes from '../../../context/global/types';

// ICONS
import CloseIcon from '../../Icons/Close';

// COMPONENTS
import Button from '../../Button';
import Input from '../../Input';

// STYLES
import styles from './ChangePassword.module.scss';

function ChangePassword({ active }) {
  const store = useStore();
  const [inputTypes] = useState(['password', 'text', 'email']);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordVerification, setNewPassworVerification] = useState('');
  const [passwordInputType, setPasswordInputType] = useState('password');

  async function changePassword(body) {
    if (!body) {
      throw new Error('Too few arguments specified in changePassword');
    }

    setLoading(true);

    const domain = config.api.domain;
    const apiVersion = config.api.version;

    try {
      const response = await Request.post({
        baseURL: domain,
        endpoint: '/v' + apiVersion + '/change-password',
        body,
      });

      const data = response.data;

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_ALERT,
        payload: {
          message: data.message,
          type: 'success',
        },
      });

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_CHANGE_PASSWORD_MODAL,
        payload: false,
      });
    } catch (error) {
      setLoading(false);

      if (error.response) {
        if (error.response.data) {
          const errors = error.response.data;

          for (let i = 0; i < errors.length; i++) {
            const title = errors[i].description;

            store.dispatchGlobal({
              type: globalDispatchTypes.SET_ALERT,
              payload: {
                message: title,
                type: 'error',
              },
            });
          }
        }

        return;
      }

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_ALERT,
        payload: {
          message: 'Something went wrong',
          type: 'error',
        },
      });
    }
  }

  function closeModal() {
    store.dispatchGlobal({
      type: globalDispatchTypes.SET_CHANGE_PASSWORD_MODAL,
      payload: false,
    });
  }

  return active ? (
    <section className={cn(styles['container'])}>
      <div onClick={() => closeModal()} className={cn(styles['background'], 'trnstn')} />

      <div className={cn(styles['modal'], 'trnstn')}>
        <div className={cn(styles['title-area'], 'flx-btw-ctr', 'trnstn')}>
          <div className={cn(styles['title'])}>Change password</div>
          <CloseIcon
            onClick={() => {
              closeModal();
            }}
          />
        </div>

        <div className={cn(styles['subtitle'], 'trnstn')}>Password should be minimum 8 characters long.</div>

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>Current password</label>
          </div>
          <Input placeholder="Current password..." type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} fullWidth />
        </div>

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>New password</label>
          </div>
          <Input placeholder="New password..." type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth />
        </div>

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>New password again</label>
          </div>
          <Input placeholder="New password again..." type="password" value={newPasswordVerification} onChange={(e) => setNewPassworVerification(e.target.value)} fullWidth />
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

            changePassword({
              currentPassword,
              newPassword,
              newPasswordVerification,
            });
          }}
          primary
        />
      </div>
    </section>
  ) : null;
}

export default ChangePassword;
