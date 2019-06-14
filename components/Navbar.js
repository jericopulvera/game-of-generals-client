import React, { Component } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import * as authApi from '@api/auth';
import { removeUser } from '@store/actions/userActions';
import Router from 'next/router';
import { destroyCookie } from 'nookies';

const LoginModal = dynamic(() => import('@components/Modals/LoginModal'), {
  loading: () => (
    <div className="fixed h-screen w-full flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        Loading...
      </div>
    </div>
  ),
  ssr: false,
});

const SignUpModal = dynamic(() => import('@components/Modals/SignUpModal'), {
  ssr: false,
});

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { loginModalIsVisible: false, signUpModalIsVisible: false };
  }

  handleLogout(e) {
    e.preventDefault();
    this.props.removeUser();
    destroyCookie(this.props, 'token');
    Router.push('/');
    // authApi
    //   .logoutUser()
    //   .then(() => {
    //     Router.push('/');
    //     alert("You've been logged out successfully.");
    //     this.props.removeUser();
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     alert('Something went wrong!');
    //   });
  }

  render() {
    const isAuthenticated = Boolean(this.props.user);

    return (
      <div>
        <nav className="mt-4 flex justify-center">
          {this.state.loginModalIsVisible && (
            <LoginModal
              onClose={() => this.setState({ loginModalIsVisible: false })}
            />
          )}

          {this.state.signUpModalIsVisible && (
            <SignUpModal
              onClose={() => this.setState({ signUpModalIsVisible: false })}
            />
          )}
          <ul className="overflow-x-auto flex items-center sm:justify-center font-semibold mx-2">
            <Link href="/">
              <a className="flex-shrink-0 no-underline px-4">HOME</a>
            </Link>
            {isAuthenticated && (
              <Link href="/matches">
                <a className="flex-shrink-0 no-underline px-4">MY MATCHES</a>
              </Link>
            )}
            {!isAuthenticated ? (
              <a
                className="flex-shrink-0 no-underline px-4 cursor-pointer"
                onClick={() => this.setState({ loginModalIsVisible: true })}
              >
                LOGIN
              </a>
            ) : (
              <a
                className="flex-shrink-0 no-underline px-4 cursor-pointer"
                onClick={e => this.handleLogout(e)}
              >
                LOGOUT
              </a>
            )}
            {/* {!isAuthenticated && (
              <a
                className="flex-shrink-0 no-underline px-4 cursor-pointer"
                onClick={() => this.setState({ signUpModalIsVisible: true })}
              >
                SIGN UP
              </a>
            )} */}
          </ul>
          {this.props.user && (
            <div className="absolute mt-12">email: {this.props.user.email}</div>
          )}
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = { removeUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
