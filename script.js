'use strict';

// Data
const account1 = {
  owner: 'Alberto Roldán',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-09-05T16:33:06.386Z',
    '2021-01-25T14:43:26.374Z',
    '2021-04-16T18:49:59.371Z',
    '2021-04-17T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'es-ES', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

//
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yersterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

//Display movements in the application
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcomes.toFixed(2))}€`;
  const totalInterest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${totalInterest.toFixed(2)}€`;
};

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event handlers:
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting:
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  //Check if credentials are correct
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //Display UI
    containerApp.style.opacity = 100;

    // let now = new Date();
    // const day = String(now.getDate()).padStart(2, '0');
    // const month = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
    // const year = now.getFullYear();
    // const hour = String(now.getHours()).padStart(2, '0');
    // const min = String(now.getMinutes()).padStart(2, '0');
    // now = `${day}/${month}/${year}, ${hour}:${min}h`;
    // labelDate.textContent = now;
    //Display current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

//Implement transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });

  //Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  //Checks if amount is a positive number and if current user has enough money

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //Adds negative movement to current user
    currentAccount.movements.push(-amount);
    //Adds positive movement to recipient
    receiverAccount.movements.push(amount);
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    //Update UI
    updateUI(currentAccount);
  }
});

//Implement loan request
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestedLoan = Math.floor(inputLoanAmount.value);
  if (
    requestedLoan > 0 &&
    currentAccount.movements.some(function (deposit) {
      return deposit >= requestedLoan * 0.1;
    }) === true
  ) {
    //Adds requestedLoan to user
    currentAccount.movements.push(requestedLoan);
    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
    //Clear input fields
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

//Delete account from accounts array
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);
    //Clear input fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputTransferTo.blur();
    //Hide UI
    containerApp.style.opacity = 0;
  }
});

//Implement sorting functionality
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//////////////////////////

//Fake always logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

//////////////////////////
