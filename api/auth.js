import cookie from 'js-cookie';
import axios from 'axios';

const apiUrl = process.env.API_URL
  ? process.env.API_URL
  : 'http://localhost:3333';

export function loginUser(email, password) {
  return axios
    .post(`${apiUrl}/v1/auth/login`, { email, password })
    .then(response => {
      const { token } = response.data.data;
      cookie.set('token', token, { expires: 1 });
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      return token;
    });
}

export function loginWithFacebook(accessToken) {
  return axios
    .post(`${apiUrl}/v1/auth/facebook`, { accessToken })
    .then(response => {
      const { token } = response.data.data;
      cookie.set('token', token, { expires: 1 });
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      return token;
    });
}

export function loginWithGoogle(idToken) {
  return axios.post(`${apiUrl}/v1/login/google`, { idToken }).then(response => {
    const { token } = response.data.data;
    cookie.set('token', token, { expires: 1 });
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    return token;
  });
}

export function fetchUser(token = undefined) {
  if (!token) {
    return axios.get(`${apiUrl}/v1/auth/me`);
  }
  return axios.get(`${apiUrl}/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function logoutUser() {
  return axios.delete(`${apiUrl}/v1/auth/logout`).then(() => {
    cookie.remove('token');
    delete axios.defaults.headers.common.Authorization;
  });
}

export function registerUser(
  firstName,
  lastName,
  mobile,
  country,
  gender,
  email,
  birthday,
  address,
  password
) {
  return axios
    .post(`${apiUrl}/v1/c/register`, {
      firstName,
      lastName,
      mobile,
      country,
      gender,
      email,
      birthday,
      address,
      password,
    })
    .then(response => response.data);
}
