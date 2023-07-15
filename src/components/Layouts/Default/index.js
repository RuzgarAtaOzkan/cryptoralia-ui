// MODULES
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Script from 'next/script';

// CONFIG
import config from '../../../config';

// CONTEXT
import gdt from '../../../context/global/types';

// CONTEXT
import { useStore } from '../../../context';

// COMPONENTS
import HeaderV2 from '../../HeaderV2';
import Footer from '../../Footer';
import Toaster from '../../Toaster';
import AdsHeader from '../../Ads/Header';
import CookieConsent from '../../CookieConsent';

// COMPONENTS > MODALS
import LoginModal from '../../Modals/Login';
import SignupModal from '../../Modals/Signup';
import ChangePasswordModal from '../../Modals/ChangePassword';
import ResetPasswordModal from '../../Modals/ResetPassword';

// UTILS
import getProfile from '../../../utils/getProfile';

// STYLES
import styles from './Default.module.scss';

// test

async function initLayout(router, auth, store) {
  if (!router) {
    return null;
  }

  const response = await getProfile(store);

  if (!response && auth && config.env.NODE_ENV === 'production') {
    return router.push('/');
  }

  if (response) {
    if (!response.data && auth && config.env.NODE_ENV === 'production') {
      return router.push('/');
    }
  }
}

function analytics() {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'G-KD3VTW55NP');
  }
}

function DefaultLayout({ element, auth, ads = [] }) {
  const store = useStore();
  const router = useRouter();
  const mainRef = useRef();
  const modals = store.global.modals;
  const alerts = store.global.alerts;

  useEffect(() => {
    initLayout(router, auth, store);

    setTimeout(() => {
      if (config.env.NODE_ENV === 'development') {
        window.localStorage.removeItem('cc');
      }

      const cc = window.localStorage.getItem('cc');

      if (!cc || cc === '0') {
        store.dispatchGlobal({
          type: gdt.SET_CCOPEN,
          payload: true,
        });
      }
    }, 3000);
  }, []);

  return (
    <>
      <HeaderV2 />

      <main ref={mainRef} className={cn(styles['main'])}>
        <LoginModal active={modals.login} />
        <SignupModal active={modals.signup} />
        <ChangePasswordModal active={modals.changePassword} />
        <ResetPasswordModal active={modals.resetPassword} />

        <Toaster data={alerts} />

        <CookieConsent />

        <AdsHeader data={ads} />

        {element}
      </main>

      <Footer />

      <Script async id="analytics-script">
        {analytics()}
      </Script>

      <Script async id="gtag-script" src="https://www.googletagmanager.com/gtag/js?id=G-KD3VTW55NP" />

      {/**
         * 
         *       <Script
        async="async"
        data-cfasync="false"
        src="//pl17482876.highperformancegate.com/a8ec02f787460ae4737f738e2e0666d3/invoke.js"
      />
         */}

      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      <Script
        id="7884391113621264"
        async
        onError={(e) => {
          console.error('Script failed to load', e);
        }}
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7884391113621264"
        crossorigin="anonymous"
      />
    </>
  );
}

export default DefaultLayout;
