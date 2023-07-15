// MODULES
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// CONFIG
import config from '../../config';

// CONTEXT
import { useStore } from '../../context';
import gdt from '../../context/global/types';

// PAGE COMPONENTS
import LoadingPage from '../Loading';

// COMPONENTS
import Input from '../../components/Input';
import Button from '../../components/Button';

// UTILS
import processImg from '../../utils/processImg';
import editProfile from '../../utils/editProfile';
import reqInstance from '../../utils/axios';

// STYLES
import styles from './Profile.module.scss';

function ProfilePage() {
  const store = useStore();
  const imgRef = useRef();

  const [emailVerified, setEmailVerified] = useState(true);
  const [emailVerifiedTimer, setEmailVerifiedTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imgErrMsg, setImgErrMsg] = useState('');
  const [data, setData] = useState({
    profileImgBase64: '',
    username: '',
    email: '',
  });

  async function resendEmailVerificationLink(email) {
    if (!email) {
      throw new Error('Too few arguments specified in email');
    }

    const domain = config.api.domain;
    const apiVersion = config.api.version;
    const endpoint = '/v' + apiVersion + '/send-email/verify-email';
    const url = domain + endpoint;

    setEmailVerified(true);
    setLoading(true);

    try {
      const response = await reqInstance.post(url, { email });
      const data = response.data;

      store.dispatchGlobal({
        type: gdt.SET_ALERT,
        payload: {
          message: data.message,
          type: 'info',
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);

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
      }

      store.dispatchGlobal({
        type: gdt.SET_ALERT,
        payload: {
          message: 'Something went wrong',
          type: 'error',
        },
      });
    }
  }

  useEffect(() => {
    clearTimeout(emailVerifiedTimer);

    const id = setTimeout(() => {
      setEmailVerified(store.auth.user.emailVerified);
    }, 1500);

    setEmailVerifiedTimer(id);
  }, [store]);

  useEffect(() => {
    setData({
      ...data,
      username: store.auth.user.username,
      email: store.auth.user.email,
      profileImgURL: store.auth.user.profileImgURL,
    });

    if (store.auth.authState === 2) {
      setLoading(false);
    }
  }, [store.auth]);

  return loading ? (
    <LoadingPage />
  ) : (
    <>
      <section className={cn(styles['profile-section'], 'flx-ctr-ctr')}>
        <div className={cn(styles['profile'], 'flx-btw-end')}>
          <div className={cn(styles['left'])}>
            <div className={cn(styles['title-area'])}>
              <h1>Profile Settings</h1>
            </div>

            <div className={cn(styles['input-area'])}>
              <h5>Avatar</h5>

              <div className={cn(styles['avatar-area'], 'flx-ctr-ctr')}>
                <img ref={imgRef} src={store.auth.user.profileImgURL || '/assets/images/cryptoralia-logo.png'} alt="Avatar" title="Avatar" className={cn(styles['avatar'])} />

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    processImg(
                      file,
                      null,
                      imgRef,
                      (result) => {
                        if (result === 'size-error') {
                          imgRef.current.style.display = 'none';
                          setImgErrMsg('File size cannot exceed 1mb');
                          setData({ ...data, profileImgBase64: '' });
                          return;
                        }

                        if (result === 'type-error') {
                          setImgErrMsg('Invalid file type specified; Only jpeg, png, jpg');

                          imgRef.current.style.display = 'none';
                          setData({ ...data, profileImgBase64: '' });
                          return;
                        }

                        imgRef.current.style.display = 'block';
                        setImgErrMsg('');
                        setData({
                          ...data,
                          profileImgBase64: result,
                        });
                      },
                      'd',
                    );
                  }}
                />
              </div>
            </div>

            <div className={cn(styles['profile-img-err-area'], imgErrMsg ? styles['profile-img-err-area-active'] : null)}>{imgErrMsg}</div>

            <div className={cn(styles['input-area'])}>
              <h5>Username</h5>

              <div className={cn(styles['bottom'], 'flx-str-ctr')}>
                <Input
                  type="text"
                  placeholder="Username..."
                  value={data.username}
                  onChange={(e) => {
                    setData({ ...data, username: e.target.value });
                  }}
                />
              </div>
            </div>

            <div className={cn(styles['input-area'])}>
              <h5>Email</h5>

              <div className={cn(styles['bottom'], 'flx-str-ctr')}>
                <Input type="email" placeholder="Email..." value={store.auth.user.email} className={styles['passive-input-text']} />
              </div>
            </div>

            <div className={cn(styles['resend-email-verification'], emailVerified ? null : styles['resend-email-verification-active'])}>
              You haven{"'"}t verified your email yet.{' '}
              <span
                onClick={() => {
                  resendEmailVerificationLink(store.auth.user.email);
                  setEmailVerified(true);
                }}
                className={cn(styles['resend-email-verification-btn'])}
              >
                Click here to resend email verification link.
              </span>
            </div>

            <Button
              className={cn(styles['button'])}
              title="Change password"
              onClick={() => {
                store.dispatchGlobal({
                  type: gdt.SET_CHANGE_PASSWORD_MODAL,
                  payload: true,
                });
              }}
            />

            <Button
              className={cn(styles['button'], styles['save-btn '])}
              title="Save"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await editProfile(data, store);
                setLoading(false);
              }}
              primary
            />
          </div>
          <div className={cn(styles['right'])}></div>
        </div>
      </section>
    </>
  );
}

export default ProfilePage;
