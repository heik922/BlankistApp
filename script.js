'use strict';

// testing account 1 : js ( 1111 )
// testing account 2 : jd ( 2222 )
const account1 = {
  owner: 'Jonas Schmedtmann',
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

// all calculate functions ...

const now = new Date();
const optionDate = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};
const optionCurrency = {
  style: 'currency',
  currency: 'USD',
};
labelDate.textContent = new Intl.DateTimeFormat('en-US', optionDate).format(
  now
);

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movSorted = sort
    ? acc.movements.slice().sort((a, b) => (a > b ? 1 : -1))
    : acc.movements;

  movSorted.forEach(function (mov, i) {
    const movType = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const formatedDate = new Intl.DateTimeFormat('en-US', optionDate).format(
      date
    );
    const formatedMov = new Intl.NumberFormat('en-US', optionCurrency).format(
      mov
    );

    const html = `
       <div class="movements__row">
          <div class="movements__type movements__type--${movType}">${
      i + 1
    } ${movType}</div>
          <div class="movements__date">${formatedDate}</div>
          <div class="movements__value">${formatedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
function computeUsername(accounts) {
  accounts.forEach(function (acc, key, accounts) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
function displayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur).toFixed(2);
  const formatedBalance = new Intl.NumberFormat('en-US', optionCurrency).format(
    acc.balance
  );
  labelBalance.textContent = `${formatedBalance}`;
}
function displaySummary(acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  const insterest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => mov * acc.interestRate * 0.01)
    .filter(ins => ins >= 1)
    .reduce((acc, curr) => acc + curr);

  const formatedIncome = new Intl.NumberFormat('en-US', optionCurrency).format(
    income
  );
  const formatedOut = new Intl.NumberFormat('en-US', optionCurrency).format(
    out
  );
  const formatedInsterest = new Intl.NumberFormat(
    'en-US',
    optionCurrency
  ).format(insterest);
  labelSumIn.textContent = `${formatedIncome}`;
  labelSumOut.textContent = `${formatedOut}`;
  labelSumInterest.textContent = `${formatedInsterest}`;
}
function updateUI(acc) {
  displayMovements(acc);
  displayBalance(acc);
  displaySummary(acc);
}
function startTimer() {
  let time = 300;
  const countDown = function () {
    const min = Math.trunc(time / 60);
    const sec = time % 60;
    labelTimer.textContent = `${String(min).padStart(2, 0)}:${String(
      sec
    ).padStart(2, 0)}`;

    if (time === -1) {
      clearInterval(timer);
      containerApp.style.opacity = '0';
      labelWelcome.textContent = `Log in to get Started`;
    }

    time--;
  };
  countDown();
  const timer = setInterval(countDown, 1000);

  return timer;
}

computeUsername(accounts);
let currentAcc, timer;
let sorted = false;

// implements buttons functions ...

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form to submitting

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';

    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    updateUI(currentAcc);

    if (timer) clearInterval(timer);
    timer = startTimer();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    amount <= currentAcc.balance &&
    receiverAcc?.username !== currentAcc.username
  ) {
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    currentAcc.movements.push(-amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAcc);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const deleteAcc = accounts.find(a => a.username === inputCloseUsername.value);
  if (
    deleteAcc?.pin === Number(inputClosePin.value) &&
    deleteAcc.username === currentAcc.username
  ) {
    const index = accounts.findIndex(
      acc => acc.username === deleteAcc.username
    );
    accounts.splice(index, 1);

    // reset the UI
    containerApp.style.opacity = '0';
    inputClosePin.value = inputCloseUsername.value = '';
    labelWelcome.textContent = `Log in to get Started`;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAcc.movements
      .filter(mov => mov > 0)
      .some(deposit => deposit > amount * 0.1)
  ) {
    currentAcc.movements.push(amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAcc);
    inputLoanAmount.value = '';
  }
});

btnSort.addEventListener('click', function () {
  if (sorted === true) {
    displayMovements(currentAcc, false);
    sorted = false;
  } else {
    displayMovements(currentAcc, true);
    sorted = true;
  }
});
