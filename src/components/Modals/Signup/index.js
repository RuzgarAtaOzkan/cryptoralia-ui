// MODULES
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

// CONFIG
import config from '../../../config';

// CONTEXT
import { useStore } from '../../../context';
import globalDispatchTypes from '../../../context/global/types';

// ICONS
import CloseIcon from '../../Icons/Close';
import EyeIcon from '../../Icons/Eye';

// COMPONENTS
import Button from '../../Button';
import Input from '../../Input';
import Anchor from '../../Anchor';

// UTILS
import signup from '../../../utils/signup';

// STYLES
import styles from './Signup.module.scss';

function Signup({ active }) {
  const captchaSiteKey = config.captchaSiteKey;

  const store = useStore();
  const formRef = useRef();

  const alphanumerics = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789©™£';
  const [loading, setLoading] = useState(false);

  // INPUT VALUES
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerification, setPasswordVerification] = useState('');
  const [passwordInputType, setPasswordInputType] = useState('password');

  // INPUT ERRORS
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVerificationError, setPasswordVerificationError] = useState(false);

  // INPUT TIMERS
  const [emailInputTimer, setEmailInputTimer] = useState(0);
  const [usernameInputTimer, setUsernameInputTimer] = useState(0);
  const [passwordInputTimer, setPasswordInputTimer] = useState(0);
  const [passwordVerificationInputTimer, setPasswordVerificationInputTimer] = useState(0);

  function closeModal() {
    store.dispatchGlobal({
      type: globalDispatchTypes.SET_SIGNUP_MODAL,
      payload: false,
    });
  }

  useEffect(() => {
    if (store.global.modals.signup) {
      const exists = document.getElementById('hcaptcha-script');
      const script = document.createElement('script');

      if (exists) {
        return;
      }

      script.setAttribute('type', 'text/javascript');
      script.setAttribute('id', 'hcaptcha-script');
      script.setAttribute('src', 'https://js.hcaptcha.com/1/api.js');
      document.body.appendChild(script);
    }
  }, [store.global.modals.signup]);

  return (
    <section className={cn(styles['container'], active ? styles['container-active'] : null)}>
      <div
        onClick={() => {
          closeModal();
        }}
        className={cn(styles['background'], 'trnstn')}
      />

      <div className={cn(styles['modal'], 'trnstn')}>
        <div className={cn(styles['title-area'], 'flx-btw-ctr', 'trnstn')}>
          <div className={cn(styles['title'])}>Signup</div>
          <CloseIcon
            onClick={() => {
              closeModal();
            }}
          />
        </div>
        <div className={cn(styles['subtitle'], 'trnstn')}>
          Already have an account?{' '}
          <span
            onClick={() => {
              closeModal();

              store.dispatchGlobal({
                type: globalDispatchTypes.SET_LOGIN_MODAL,
                payload: true,
              });
            }}
          >
            Login
          </span>{' '}
          to Cryptoralia
        </div>

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>Email</label>
          </div>
          {emailError ? (
            <div className={cn(styles['error-title'])}>
              <label>Invalid Email Specified</label>
            </div>
          ) : null}

          <Input
            type="email"
            placeholder="Enter your email..."
            className={cn(emailError ? styles['error-border'] : null)}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              clearTimeout(emailInputTimer);

              const timer = setTimeout(() => {
                if (!e.target.value.includes('@') && !e.target.value.includes('.')) {
                  setEmailError(true);

                  return;
                }

                setEmailError(false);
              }, 1200);

              setEmailInputTimer(timer);
            }}
            fullWidth
          />
        </div>

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>Username</label>
          </div>
          {usernameError ? (
            <div className={cn(styles['error-title'])}>
              <label>Username can only contain alphanumeric characters</label>
            </div>
          ) : null}
          <Input
            type="text"
            placeholder="Enter your username..."
            className={cn(usernameError ? styles['error-border'] : null)}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);

              clearTimeout(usernameInputTimer);

              const timer = setTimeout(() => {
                for (let i = 0; i < e.target.value.length; i++) {
                  if (!alphanumerics.includes(e.target.value[i])) {
                    setUsernameError(true);

                    return;
                  }
                }

                setUsernameError(false);
              }, 1200);

              setUsernameInputTimer(timer);
            }}
            fullWidth
          />
        </div>

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>Password</label>
          </div>

          {passwordError ? (
            <div className={cn(styles['error-title'])}>
              <label>Invalid password. Password should contain at least 8 character</label>
            </div>
          ) : null}

          <div className={cn(styles['password-input'], 'flx-end-ctr')}>
            <Input
              type={passwordInputType}
              placeholder="Enter your password..."
              className={cn(passwordError ? styles['error-border'] : null)}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                clearTimeout(passwordInputTimer);

                const timer = setTimeout(() => {
                  if (e.target.value.length < 8) {
                    setPasswordError(true);
                    return;
                  }

                  setPasswordError(false);
                }, 1200);

                setPasswordInputTimer(timer);
              }}
              fullWidth
            />
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

        <div className={cn(styles['input-area'])}>
          <div className={cn(styles['title'])}>
            <label>Password again</label>
          </div>

          {passwordVerificationError ? (
            <div className={cn(styles['error-title'])}>
              <label>Password and password reply is not the same.</label>
            </div>
          ) : null}
          <Input
            type="password"
            placeholder="Password again..."
            className={cn(passwordVerificationError ? styles['error-border'] : null)}
            value={passwordVerification}
            onChange={(e) => {
              setPasswordVerification(e.target.value);

              clearTimeout(passwordVerificationInputTimer);

              const timer = setTimeout(() => {
                if (password !== e.target.value) {
                  setPasswordVerificationError(true);

                  return;
                }
                setPasswordVerificationError(false);
              }, 1200);

              setPasswordVerificationInputTimer(timer);
            }}
            onPaste={(e) => {
              e.preventDefault();
              return false;
            }}
            fullWidth
          />
        </div>

        <Button
          className={cn(styles['button'])}
          primary
          disabled={loading}
          title="Create an account"
          onClick={(e) => {
            if (loading) {
              e.preventDefault();
              return;
            }

            const captchaToken = formRef.current.elements[0].value;

            if (!captchaToken) {
              store.dispatchGlobal({
                type: globalDispatchTypes.SET_ALERT,
                payload: {
                  message: 'Please fill the captcha',
                  type: 'error',
                },
              });

              return;
            }

            const body = {
              email,
              username,
              password,
              passwordVerification,
              captchaToken,
            };

            signup(body, store, setLoading);
          }}
        />

        <div className={cn(styles['captcha-area'], 'flx-ctr-ctr')}>
          <form ref={formRef} method="POST" action="">
            <div className="h-captcha" data-sitekey={captchaSiteKey}></div>
          </form>
        </div>

        <div className={cn(styles['privacy-policy'])}>
          <div className={cn(styles['text'])}>
            By proceeding, you agree to Cryptoralia <Anchor href="/terms-and-conditions" content="Terms & Conditions" /> & <Anchor href="/privacy-policy" content="Privacy Policy." />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
