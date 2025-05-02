import { login } from './login';
import { displayMap } from './leaflet';
import { logout } from './login';
import { updateSettings } from './updateSettings';
import { showAlert } from './alert';
import axios from 'axios';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookTourButton = document.getElementById('book-tour');

// DELAGATION
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', () => {
    logout();
    console.log('logout onclick');
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];
    const form = new FormData();

    if (name) form.append('name', name);
    if (email) form.append('email', email);
    if (photo) form.append('photo', photo);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'updating....';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// BOOK TOUR BUTTON EVENT LISTENER
if (bookTourButton) {
  bookTourButton.addEventListener('click', async (e) => {
    console.log('book tour button click!');
    e.target.textContent = 'Processing...';
    const tourID = e.target.dataset.tourId;

    try {
      const session = await axios({
        method: 'GET',
        url: `/api/v1/bookings/checkout-session/${tourID}`,
      });
      console.log(session);
      console.log('this is the try block');

      window.location.assign(session.data.session.data.attributes.checkout_url);
    } catch (err) {
      showAlert('error', err.response.data.message);
      console.error('Error booking tour:', err);
      e.target.textContent = 'Book tour now!';
    }
  });
}
