import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
let markup;

countryInput.addEventListener(
  'input',
  debounce(onSeachCountry, DEBOUNCE_DELAY)
);

function onSeachCountry(evt) {
  const name = evt.target.value.trim();
  console.log(name);
  fetchCountries(name)
    .then(data => onMarkup(data))
    .catch(err => {
      countryInfo.innerHTML = '';
      if (name === '') {
        return;
      }

      return Notify.failure('Oops, there is no country with that name');
    });
}

function onMarkup(arr) {
  console.log(arr.length);
  if (arr.length > 10) {
    countryList.innerHTML = '';
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (2 < arr.length < 10) {
    markup = arr
      .map(item => {
        return `<li class="item-country">
            <img class="img-flag" src="${item.flags.svg}" alt="flag of country" width=35 height = 25> <h2 class="name-country">${item.name}</h2></li>
          `;
      })
      .join('');
    countryList.innerHTML = markup;
    countryInfo.innerHTML = '';
  }
  if (arr.length === 1) {
    markup = arr
      .map(item => {
        return `

        <div class="item-info">
          <p><b>Capital</b>: ${item.capital}</p>
          <p><b>Population</b>: ${item.population}</p>
          <p><b>Languages</b>: ${item.languages
            .map(el => el.name)
            .join(', ')}</p></div>
        `;
      })
      .join('');
    countryInfo.innerHTML = markup;
  }
}
