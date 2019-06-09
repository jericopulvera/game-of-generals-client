import React from 'react';
import defaultLayout from '@layouts/defaultLayout';
import guestOnly from '@middleware/guestOnly';

const Page = () => <p>Registration Page</p>;

Page.getInitialProps = async ctx => {
  await guestOnly(ctx);
};

export default defaultLayout(Page);
