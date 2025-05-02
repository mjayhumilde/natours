import axios from 'axios';
import { showAlert } from './alert';

// type is eithier password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${
          type === 'password' ? 'Password ' : 'Infomation'
        } Updated Successfully!`
      );
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
