// Focuses on name input when page loads
const userName = document.querySelector('#name');
userName.focus();

//--------- Job Role Section ---------//
const jobRole = document.querySelector('#title');
const otherJobRole = document.querySelector('#other-job-role');
otherJobRole.style.display = 'none';

jobRole.addEventListener('change', (e) => {
  if (e.target.value === 'other') {
    otherJobRole.style.display = '';
  } else {
    otherJobRole.style.display = 'none';
  }
})

//--------- T-Shirt Info Section ---------//
const shirtDesign = document.querySelector('#design');
const shirtColor = document.querySelector('#color');
const colorChildren = shirtColor.children;

shirtColor.disabled = true;

shirtDesign.addEventListener("change", (e) => {
  shirtColor.disabled = false;
  for (let i = 0; i < colorChildren.length; i++) {
    let eventTarget = e.target.value;
    let dataTheme = colorChildren[i].getAttribute('data-theme')
    if (eventTarget === dataTheme) {
      colorChildren[i].hidden = false;
      colorChildren[i].selected = true;
    } else if (eventTarget !== dataTheme) {
      colorChildren[i].hidden = true;
      colorChildren[i].selected = false;
    }
  }
})

//--------- Activity Section ---------//
const registerForActivities = document.querySelector('#activities');
const totalCost = document.querySelector('#activities-cost');
const actBox = document.querySelector('#activities-box');
const checkBox = actBox.querySelectorAll('input[type="checkbox"]');

let totalCostSum = 0;

registerForActivities.addEventListener("change", (e) => {
  //Activities cost & total cost sum
  let dataCost = parseInt(e.target.getAttribute('data-cost'));
  if (e.target.checked) {
    totalCostSum += dataCost;
  } else {
    totalCostSum -= dataCost;
  }
  totalCost.innerHTML = `Total: $${totalCostSum}`;

  //Activities focus and blur indicator
  for (let i = 0; i < checkBox.length; i++) {
    let label = checkBox[i].parentNode;
    if (checkBox[i].checked) {
      label.classList.add('focus');
    } else {
      label.classList.remove('focus');
    }
  }

  //Checks for any conflicting events, for added future events also
  const dataDayTime = e.target.getAttribute('data-day-and-time');
  for (let i = 0; i < checkBox.length; i++) {
    const currentSelectedTime = checkBox[i].getAttribute('data-day-and-time');
    if (dataDayTime === currentSelectedTime) {
      console.log(currentSelectedTime);
      console.log(dataDayTime)
    }
  }
});




//--------- Payment Section ---------//
const userSelectedPayment = document.querySelector('#payment');
const creditCard = document.getElementById('credit-card');
const payPal = document.getElementById('paypal');
const bitcoin = document.getElementById('bitcoin');

payPal.hidden = true;
bitcoin.hidden = true;

userSelectedPayment.children[1].setAttribute('selected', '');

userSelectedPayment.addEventListener("change", (e) => {
  let paymentMethod = e.target.value;
  if (paymentMethod === 'paypal') {
    creditCard.hidden = true;
    payPal.hidden = false;
    bitcoin.hidden = true;
  } else if (paymentMethod === 'bitcoin') {
    creditCard.hidden = true;
    payPal.hidden = true;
    bitcoin.hidden = false;
  } else if (paymentMethod === 'credit-card') {
    creditCard.hidden = false;
    payPal.hidden = true;
    bitcoin.hidden = true;
  }
})

//--------- Form & Payment Validation Section ---------//
const userEmail = document.querySelector('#email');
const ccNumber = document.querySelector('#cc-num');
const ccZipCode = document.querySelector('#zip');
const cvv = document.querySelector('#cvv')
const theForm = document.querySelector('form');
const invalidCVV = document.querySelector('#invalid-cvv');

invalidCVV.hidden = true;

// Validation functions that will pass / fail according to the required input //
function validationPass(element) {
  element.parentElement.classList.add('valid');
  element.parentElement.classList.remove('not-valid');
  element.parentElement.lastElementChild.hidden = true;
}
function validationFail(element) {
  element.parentElement.classList.add('not-valid');
  element.parentElement.classList.remove('valid');
  element.parentElement.lastElementChild.hidden = false;
}

// Form validators for each input field (Name, Email, CC Number, Zip, CVV) //
// Name Validator // 
function nameValidator() {
  const nameIsValid = /^[a-zA-Z]+ ?[a-zA-Z]*? ?[a-zA-Z]*? ?[a-zA-Z]*?$/.test(userName.value);

  if (nameIsValid) {
    validationPass(userName)
  } else {
    validationFail(userName)
  }
  return nameIsValid;
}

// Email Validator //
function emailValidator() {
  const emailIsValid = /^[^@]+@[^@.]+\.[a-z]+$/i.test(userEmail.value);

  if (emailIsValid) {
    validationPass(userEmail);
  } else {
    validationFail(userEmail)
  }
  return emailIsValid
}

// CC Number Validator -  Added replace method to make it more realistic and appealing. The CC input is applicable for worldwide cc cards that accepts either 2 to 4 last group of numbers  //
function ccNumValidator() {
  function formatCcNum(text) {
    const regex = /^(\d{4})(\d{4})(\d{4})(\d{2,4})$/;
    return text.replace(regex, '$1-$2-$3-$4')
  }

  ccNumber.addEventListener("blur", e => {
    e.target.value = formatCcNum(e.target.value);
  })

  let ccIsValid = /^(\d{4})(\d{4})(\d{4})(\d{2,4})|(\d{4})-(\d{4})-(\d{4})-(\d{2,4})$/.test(ccNumber.value);

  if (ccIsValid) {
    validationPass(ccNumber);
  } else {
    validationFail(ccNumber)
  }
  return ccIsValid
}

// Zipcod Validator - This zipcode is valid for my country Indonesia which is 5 digit zipcode //
function zipValidator() {
  let zipIsValid = /^\d{5}$/.test(ccZipCode.value);

  if (zipIsValid) {
    validationPass(ccZipCode);
  } else {
    validationFail(ccZipCode)
  }
  return zipIsValid
}

// CVV Validator //
function cvvValidator() {
  let cvvIsValid = /^\d{3}$/.test(cvv.value);

  if (cvvIsValid) {
    validationPass(cvv);
  } else {
    validationFail(cvv)
  }
  return cvvIsValid
}

// Code taken & modified from previous Treehouse Validation exercise //
const createListener = (validator) => {
  return e => {
    const text = e.target.valid;
    const valid = validator(text);
    const showTip = text !== "" && !valid;
    const tooltip = e.target.nextElementSibling;
    showOrHideTip(showTip, tooltip);
  };
}

// Code inspired from previous Treehouse Validation exercise. Changed the listener to keyup for a more realistic response from an actual web //
userName.addEventListener('keyup', createListener(nameValidator));
userEmail.addEventListener('keyup', createListener(emailValidator));
ccNumber.addEventListener('keyup', createListener(ccNumValidator));
ccZipCode.addEventListener('keyup', createListener(zipValidator));
cvv.addEventListener('keyup', createListener(cvvValidator));

// Form submission - Some of the code here was taken & modified from Validation warmup exercise //
theForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!nameValidator()) {
    console.log('Invalid name prevented submission');
    e.preventDefault();
  }

  if (!emailValidator()) {
    console.log('Invalid email prevented submission');
    e.preventDefault();
  }

  if (!ccNumValidator()) {
    console.log('Invalid CC Number prevented submission');
    e.preventDefault();
  }

  if (!zipValidator()) {
    console.log('Invalid CC Zip Code prevented submission');
    e.preventDefault();
  }

  if (!cvvValidator()) {
    invalidCVV.hidden = false;
    console.log('Invalid CC CVV Number prevented submission');
    e.preventDefault();
  } else {
    invalidCVV.hidden = true;
  }
})