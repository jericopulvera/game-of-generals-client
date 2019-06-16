import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setUser } from '@store/actions/userActions';
import * as authApi from '@api/auth';

const mapDispatchToProps = { setUser };
const mapStateToProps = state => state;

const SignUpModal = props => {
  const { setUser } = props;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

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
    setLoading(true);
    authApi
      .registerUser(name, email, password, passwordConfirmation)
      .then(() => {
        authApi
          .loginUser(email, password)
          .then(() =>
            authApi
              .fetchUser()
              .then(response => {
                setLoading(false);
                setUser(response.data.data);
                props.onClose();
              })
              .catch(fetchUserError => {
                setLoading(false);
                alert('Something went wrong!');
                console.log({ fetchUserError });
              })
          )
          .catch(loginUserError => {
            setLoading(false);
            alert('Invalid Email or Password');
            console.log({ loginUserError });
          });
        props.onClose();
      })
      .catch(fetchUserError => {
        setLoading(false);
        let errorMessage = ``;

        fetchUserError.response.data.forEach(error => {
          errorMessage += `${error.message} \n`;
        });

        alert(errorMessage);
        console.log({ fetchUserError });
      });
  };

  return (
    <div className="fixed h-screen w-full flex items-center justify-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        ref={formElement}
        onSubmit={handleSubmit}
        style={{ width: '450px' }}
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
          <div className="flex">
            <label
              className="w-1/2 text-gray-700 text-sm font-bold"
              htmlFor="Name"
            >
              Name
            </label>
          </div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
          />
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
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
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
            placeholder="*****"
          />
          {false && (
            <p className="text-xs italic text-red-500">
              Please choose a password.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Confirm Password
          </label>
          <input
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${false &&
              'border-red-500'}`}
            id="confirm"
            type="password"
            placeholder="*****"
          />
          {/* {false && (
            <p className='text-xs italic text-red-500'>
              Please choose a password.
            </p>
          )} */}
        </div>
        <div className="flex justify-between">
          <button
            className="w-full m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpModal);
