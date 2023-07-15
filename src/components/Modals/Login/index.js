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
import EyeIcon from '../../Icons/Eye';

// COMPONENTS
import Button from '../../Button';
import Input from '../../Input';

// STYLES
import styles from './Login.module.scss';

function Login({ active }) {
  const store = useStore();

  const [loading, setLoading] = useState(false);
  const [uid, setUId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [enter, setEnter] = useState(0);

  function closeModal() {
    store.dispatchGlobal({
      type: globalDispatchTypes.SET_LOGIN_MODAL,
      payload: false,
    });

    setUId('');
    setPassword('');
    setPasswordResetEmail('');
    setPasswordInputType('password');
    setForgotPassword(false);
    setEnter(0);
  }

  async function sendPasswordResetLink(email) {
    if (!email) {
      throw new Error('Too few arguments specified in login');
    }

    const domain = config.api.domain;
    const apiVersion = config.api.version;
    setLoading(true);

    try {
      const response = await Request.post({
        baseURL: domain,
        endpoint: '/v' + apiVersion + '/send-email/reset-password',
        body: {
          email,
        },
      });

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_ALERT,
        payload: {
          message: 'Password reset link has been succcessfully sent to specified email',
          type: 'success',
        },
      });

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_LOGIN_MODAL,
        payload: false,
      });

      setPasswordResetEmail('');
      setLoading(false);

      return response;
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
      } else {
        store.dispatchGlobal({
          type: globalDispatchTypes.SET_ALERT,
          payload: {
            message: 'Something went wrong',
            type: 'error',
          },
        });
      }
    }
  }

  async function login(body) {
    if (!body) {
      throw new Error('Too few arguments specified in login');
    }

    const domain = config.api.domain;
    const apiVersion = config.api.version;
    setLoading(true);

    try {
      const response = await Request.post({
        baseURL: domain,
        endpoint: '/v' + apiVersion + '/signin',
        body,
      });

      const data = response.data;

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_ALERT,
        payload: {
          message: 'Successfully signed in',
          type: 'success',
        },
      });

      store.dispatchGlobal({
        type: globalDispatchTypes.SET_LOGIN_MODAL,
        payload: false,
      });

      store.dispatchAuth({
        type: authDispatchTypes.LOGIN,
        payload: data,
      });

      setLoading(false);

      setUId('');
      setPassword('');
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
      } else {
        store.dispatchGlobal({
          type: globalDispatchTypes.SET_ALERT,
          payload: {
            message: 'Something went wrong',
            type: 'error',
          },
        });
      }
    }
  }

  function keyDown(e) {
    if (e.keyCode === 13 && !loading && active) {
      setEnter(enter + 1);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', keyDown);

    return () => {
      window.removeEventListener('keydown', keyDown);
    };
  }, []);

  useEffect(() => {
    if (active) {
      if (forgotPassword) {
        sendPasswordResetLink(passwordResetEmail);
      } else {
        login({ uid, password });
      }
    }
  }, [enter]);

  return active ? (
    <section className={cn(styles['container'])}>
      <div
        onClick={() => {
          closeModal();

          setTimeout(() => {
            setForgotPassword(false);
          }, 300);
        }}
        className={cn(styles['background'], 'trnstn')}
      />

      {forgotPassword ? (
        <div className={cn(styles['modal'], 'trnstn')}>
          <div className={cn(styles['title-area'], 'flx-btw-ctr', 'trnstn')}>
            <div className={cn(styles['title'])}>Send Password Reset Link</div>
            <CloseIcon
              onClick={() => {
                closeModal();

                setTimeout(() => {
                  setForgotPassword(false);
                }, 300);
              }}
            />
          </div>

          <div className={cn(styles['subtitle'], 'trnstn')}>
            Go to{' '}
            <span
              onClick={() => {
                setForgotPassword(false);
              }}
            >
              Login
            </span>{' '}
            instead
          </div>

          <div className={cn(styles['input-area'])}>
            <div className={cn(styles['title'])}>
              <label>Email</label>
            </div>
            <Input type="email" placeholder="Enter your email..." value={passwordResetEmail} onChange={(e) => setPasswordResetEmail(e.target.value)} fullWidth />
          </div>

          <Button
            onClick={(e) => {
              if (loading) {
                e.preventDefault();
                return;
              }

              sendPasswordResetLink(passwordResetEmail);
            }}
            className={cn(styles['button'])}
            primary
            title="Send reset link"
            disabled={loading}
          />
        </div>
      ) : (
        <div className={cn(styles['modal'], 'trnstn')}>
          <div className={cn(styles['title-area'], 'flx-btw-ctr', 'trnstn')}>
            <div className={cn(styles['title'])}>Login</div>
            <CloseIcon
              onClick={() => {
                closeModal();

                setForgotPassword(false);
              }}
            />
          </div>

          <div className={cn(styles['subtitle'], 'trnstn')}>
            Dont have an account?{' '}
            <span
              onClick={() => {
                closeModal();

                store.dispatchGlobal({
                  type: globalDispatchTypes.SET_SIGNUP_MODAL,
                  payload: true,
                });
              }}
            >
              Signup
            </span>{' '}
            to Cryptoralia
          </div>

          <div className={cn(styles['input-area'])}>
            <div className={cn(styles['title'])}>
              <label>Email</label>
            </div>
            <Input type="email" placeholder="Enter your email address..." value={uid} onChange={(e) => setUId(e.target.value)} fullWidth />
          </div>

          <div className={cn(styles['input-area'])}>
            <div className={cn(styles['title'])}>
              <label>Password</label>
            </div>
            <div className={cn(styles['input'], 'flx-end-ctr')}>
              <Input type={passwordInputType} placeholder="Enter your password..." value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
              <EyeIcon
                onClick={() => {
                  if (passwordInputType === 'password') {
                    setPasswordInputType('text');
                  } else {
                    setPasswordInputType('password');
                  }
                }}
                active={passwordInputType === 'password' ? true : false}
              />
            </div>
          </div>

          <div
            onClick={() => {
              setForgotPassword(true);
            }}
            className={cn(styles['forgot-password'], 'trnstn')}
          >
            Forgot password?
          </div>

          <Button
            onClick={(e) => {
              if (loading) {
                e.preventDefault();
                return;
              }

              login({ uid, password });
            }}
            disabled={loading}
            className={cn(styles['button'])}
            primary
            title="Login"
          />
        </div>
      )}
    </section>
  ) : null;
}

export default Login;
