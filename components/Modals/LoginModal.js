import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setUser } from '@store/actions/userActions';
import * as authApi from '@api/auth';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import GoogleLogin from 'react-google-login';
import Router from 'next/router';

const mapDispatchToProps = { setUser };
const mapStateToProps = state => state;

// function oneSignalSetTag(id) {
//   const OneSignal = window.OneSignal || [];
//   console.log(OneSignal);
//   OneSignal.push(function() {
//     OneSignal.sendTags({
//       userId: id,
//     })
//       .then(function(tagsSent) {
//         console.log(tagsSent);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   });
// }

const LoginModal = props => {
  const { setUser } = props;
  const [email, setEmail] = useState('jerico.pulvera01z@gmail.com');
  const [password, setPassword] = useState('123123123');
  const formElement = useRef(null);

  useEffect(() => {
    const handleClick = e => {
      if (formElement.current && !formElement.current.contains(e.target)) {
        props.onClose();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [props]);

  const handleSubmit = e => {
    e.preventDefault();

    authApi
      .loginUser(email, password)
      .then(() =>
        authApi
          .fetchUser()
          .then(response => {
            // oneSignalSetTag(response.data.data._id);
            setUser(response.data.data);
            Router.push('/');
            props.onClose();
          })
          .catch(fetchUserError => {
            alert('Something went wrong!');
            console.log({ fetchUserError });
          })
      )
      .catch(loginUserError => {
        alert('Invalid Email or Password');
        console.log({ loginUserError });
      });
  };

  const responseFacebook = response => {
    authApi
      .loginWithFacebook(response.accessToken)
      .then(() =>
        authApi
          .fetchUser()
          .then(response => {
            setUser(response.data.data);
            props.onClose();
          })
          .catch(fetchUserError => {
            alert('Something went wrong!');
            console.log({ fetchUserError });
          })
      )
      .catch(loginUserError => {
        alert('Something went wrong. Please reload the page.');
        console.log({ loginUserError });
      });
  };

  // const responseGoogle = response => {
  //   authApi
  //     .loginWithGoogle(response.tokenId)
  //     .then(() =>
  //       authApi
  //         .fetchUser()
  //         .then(response => {
  //           setUser(response.data.data);
  //           props.onClose();
  //         })
  //         .catch(fetchUserError => {
  //           alert('Something went wrong!');
  //           console.log({ fetchUserError });
  //         })
  //     )
  //     .catch(loginUserError => {
  //       alert('Something went wrong. Please reload the page.');
  //       console.log({ loginUserError });
  //     });
  // };

  return (
    <div className="fixed h-screen w-full flex items-center justify-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        ref={formElement}
        onSubmit={handleSubmit}
      >
        <div className="relative" style={{ top: '-17px', right: '-20px' }}>
          <a
            onClick={props.onClose}
            className="font-bold cursor-pointer text-gray-500 text-xs absolute right-0"
          >
            X
          </a>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${false &&
              'border-red-500'}`}
            id="password"
            type="password"
            placeholder="******************"
          />
          {false && (
            <p className="text-xs italic text-red-500">
              Please choose a password.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <div className="flex items-center justify-between my-2">
          <FacebookLogin
            appId={process.env.FACEBOOK_APP_ID}
            scope="public_profile, email, user_birthday"
            fields="id,email,name,gender,picture"
            callback={responseFacebook}
            render={renderProps => (
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={renderProps.onClick}
              >
                Login With Facebook
              </button>
            )}
          />
        </div>
        {/* <div className="flex items-center justify-between my-2">
          <GoogleLogin
            clientId={process.env.GOOGLE_CLIENT_ID}
            render={renderProps => (
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Login With Google
              </button>
            )}
            autoload={false}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            // cookiePolicy={'single_host_origin'}
          />
        </div> */}
      </form>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
