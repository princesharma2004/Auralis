import { API_BASE_URL } from '../config';

export const logout = async (form) => {
    const response = await fetch(`${API_BASE_URL}/user/logout?token=${form.token}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${form.token}`,
      },
    });

    if(response.status===204) {
      return true;
    }
    else {
      return false;
    }
};

export default logout;