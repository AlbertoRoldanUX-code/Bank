'use strict';

// Data
const account1 = {
  owner: 'Alberto Roldán',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

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
  currency: 'EUR',
  locale: 'es-ES', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
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

//Display movements in the application
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  const totalInterest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${totalInterest}€`;
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
  displayMovements(acc.movements);
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
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //Display UI
    containerApp.style.opacity = 100;

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
  const amount = Number(inputTransferAmount.value);
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
    //Update UI
    updateUI(currentAccount);
  }
});

//Implement loan request
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestedLoan = Number(inputLoanAmount.value);
  if (
    requestedLoan > 0 &&
    currentAccount.movements.some(function (deposit) {
      return deposit >= requestedLoan * 0.1;
    }) === true
  ) {
    //Adds requestedLoan to user
    currentAccount.movements.push(requestedLoan);
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
    Number(inputClosePin.value) === currentAccount.pin
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
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//////////////////////////
//Eating too much = food portion is larger than recommended portion

//Eating too little = food portion is less than recommended portion

//Eating okay amount = food portion is 10% above or below recommended portion

//1º Loop over the dogs array to calculate for each dog the recommended food portion and add it to the object as a new property. Don't create a new array. The result is in grams of food, and the weight needs to be in kg.

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(function (dog) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

console.log(dogs);

//2º Find Sarah's dog and console.log if it's eating too much or too little.

const SarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  SarahsDog.curFood > SarahsDog.recommendedFood
    ? "It's eating too much"
    : "It's eating too little"
);

//3º Create an array (called ownersEatTooMuch) containing all the owners of dogs who eat too much and another one with ownersEatTooLittle.

const ownersEatTooMuch = dogs
  .filter(function (dog) {
    return dog.curFood > dog.recommendedFood;
  })
  .flatMap(dog => dog.owners);

const ownersEatTooLittle = dogs
  .filter(function (dog) {
    return dog.curFood < dog.recommendedFood;
  })
  .flatMap(dog => dog.owners);

//4º Console.log for each of the arrays something like this "Matilda and Alice and Bob's dogs eat too much!

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too much!`);

//5º Console.log if there's any dog eating an okay amount of food. Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

console.log(dogs.some(dog => dog.recommendedFood === dog.curFood));

console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

//6º Create an array containing all the dogs that are eating an okay amount of food (reuse the condition we use before)

const healthyDogs = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);

console.log(healthyDogs);

//7º Create a shallow copy of the dogs array and sort it by the recommended food portion in an ascending order

const shallowCopy = dogs.slice();

//Ascending
shallowCopy.sort(function (a, b) {
  return a.recommendedFood - b.recommendedFood;
});

console.log(shallowCopy);
