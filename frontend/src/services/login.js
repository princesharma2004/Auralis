import { API_BASE_URL } from '../config';

export const login = async (form) => {
    const response = await fetch(API_BASE_URL + '/user/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    return data;
};

export default login;
