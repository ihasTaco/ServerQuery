import axios from 'axios';

// Implement the getJwtCookie function to retrieve the JWT cookie from your chosen cookie handling library
function getJwtCookie() {
  // Replace this with your implementation to retrieve the JWT cookie
  // You might use a library like js-cookie or document.cookie to retrieve the cookie value
  // Example: return Cookies.get('jwt');
  return '';
}

axios.interceptors.request.use((config) => {
  const jwtCookie = getJwtCookie();

  if (jwtCookie) {
    config.headers.Authorization = `Bearer ${jwtCookie}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;