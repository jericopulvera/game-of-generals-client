import React from 'react';
import Head from '@components/Head';
import Navbar from '@components/Navbar';

const defaultLayout = Page =>
  class extends React.Component {
    static getInitialProps(ctx) {
      if (Page.getInitialProps) return Page.getInitialProps(ctx);
    }

    render() {
      return (
        <div className="font-sans">
          <Head />
          <Navbar />
          <section className="container mx-auto mt-12">
            <Page {...this.props} />
          </section>
        </div>
      );
    }
  };

export default defaultLayout;
