import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { setUser } from '@store/actions/userActions';
import * as authApi from '@api/auth';

const mapDispatchToProps = { setUser };
const mapStateToProps = state => state;

const SignUpModal = props => {
  const { setUser } = props;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const genderTypes = [
    {
      name: 'Male',
      slug: 'Male',
    },
    {
      name: 'Female',
      slug: 'Female',
    },
  ];

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
    setBirthday(new Date(birthday).toISOString());
    authApi
      .registerUser(
        firstName,
        lastName,
        mobile,
        gender,
        email,
        birthday,
        address,
        password
      )
      .then(() => {
        authApi
          .loginUser(email, password)
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
            alert('Invalid Email or Password');
            console.log({ loginUserError });
          });
        props.onClose();
      })
      .catch(fetchUserError => {
        alert('Something went wrong!');
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
              htmlFor="firstName"
            >
              First Name
            </label>
            <label
              className="w-1/2 text-gray-700 text-sm font-bold"
              htmlFor="lastName"
            >
              Last Name
            </label>
          </div>
          <div className="flex justify-between">
            <div className="w-1/2 p-1">
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
                placeholder="First Name"
              />
            </div>
            <div className="w-1/2 p-1">
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 w-1/2"
              htmlFor="mobile"
            >
              Mobile Number
            </label>
          </div>
          <div className="flex justify-between">
            <div className="p-1 w-1/2">
              <input
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="mobile"
                type="text"
                placeholder="Mobile Number"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Address"
          />
        </div>
        <div className="mb-4">
          <div className="flex">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 w-1/2"
              htmlFor="birthday"
            >
              Birthday
            </label>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 w-1/2"
              htmlFor="gender"
            >
              Gender
            </label>
          </div>
          <div className="flex justify-between">
            <div className="p-2 w-1/2">
              <input
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="birthday"
                type="date"
                placeholder="Birthday"
              />
            </div>
            <select
              value={gender}
              onChange={e => {
                setGender(e.target.value);
              }}
              className="w-1/2 pl-2 shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {genderTypes.map(gender => (
                <option value={gender.slug} key={gender.slug}>
                  {gender.name}
                </option>
              ))}
            </select>
          </div>
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
            placeholder="******************"
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
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${false &&
              'border-red-500'}`}
            id="confirm"
            type="password"
            placeholder="******************"
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
            type="submit"
          >
            Cancel
          </button>
          <button
            className="w-full m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
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
