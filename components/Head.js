import React from 'react';
import NextHead from 'next/head';
import { string } from 'prop-types';

const defaultTitle = 'Strength In Number';
const defaultDescription = '';
const defaultOGURL = '';
const defaultOGImage = '';
// const appId = `'${process.env.ONE_SIGNAL_APP_ID}'`;

const Head = props => {
  const { title, description, ogImage, url } = props;
  return (
    <NextHead>
      {/* <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async="" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
      var OneSignal = window.OneSignal || [];
      OneSignal.push(function() {
        OneSignal.init({
          appId: ${appId},
          notifyButton: {
            enable: true
          }
        })
      })
    `,
        }} */}
      />
      <meta charSet="UTF-8" />
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
      <link rel="apple-touch-icon" href="/static/touch-icon.png" />
      <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
      <link rel="icon" href="/static/favicon.ico" />
      <meta property="og:url" content={url || defaultOGURL} />
      <meta property="og:title" content={title || ''} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:site" content={url || defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage || defaultOGImage} />
      <meta property="og:image" content={ogImage || defaultOGImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </NextHead>
  );
};

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string,
};

export default Head;
