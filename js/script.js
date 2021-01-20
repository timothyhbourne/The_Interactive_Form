// Focuses on name input when page loads
const theForm = document.querySelector('form');
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

actBox.addEventListener('focusin', (e) => {
  for (let i = 0; i < checkBox.length; i++) {
    let labels = checkBox[i].parentNode;
    if (e.target.blur()) {
      labels[i].classList.add('focus');
    } else {
      labels[i].classList.remove('focus')
    }
  }
})

let totalCostSum = 0;

registerForActivities.addEventListener("change", (e) => {
  //Activities total cost sum
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

  // Prevents user from booking events during the same day & time
  const dataDayTime = e.target.getAttribute('data-day-and-time');
  const eventName = e.target.getAttribute('name');
  for (let i = 0; i < checkBox.length; i++) {
    const selectedTime = checkBox[i].getAttribute('data-day-and-time');
    const selectedName = checkBox[i].getAttribute('name');
    if (dataDayTime === selectedTime && eventName !== selectedName) {
      if (e.target.checked) {
        checkBox[i].parentElement.classList.add('disabled');
        checkBox[i].disabled = true;
      } else {
        checkBox[i].disabled = false;
        checkBox[i].parentElement.classList.remove('disabled');
      }
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
const invalidCVV = document.querySelector('#invalid-cvv');


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
// Name Validator - A different text will appear if user also inputs a number in name field// 
function nameValidator() {
  const nameIsValid = /^[a-zA-Z]+ ?[a-zA-Z]*? ?[a-zA-Z]*? ?[a-zA-Z]*?$/.test(userName.value);
  const nameContainsNumber = /[0-9]/.test(userName.value);

  if (nameIsValid) {
    validationPass(userName);
  } else if (nameContainsNumber) {
    validationFail(userName);
    document.querySelector('#name-hint').innerHTML = 'Name field cannot contain a number'
  } else {
    validationFail(userName);
    document.querySelector('#name-hint').innerHTML = 'Name field cannot be empty'
  }
  return nameIsValid;
}

// Email Validator //
function emailValidator() {
  const emailIsValid = /^[^@]+@[^@.]+\.[a-z]+$/i.test(userEmail.value);
  if (emailIsValid) {
    validationPass(userEmail);
  } else {
    validationFail(userEmail);
  }
  return emailIsValid;
}

// CC Number Validator -  Added replace method to make it more realistic and appealing. The CC input accepts either 2 to 4 last group of numbers  //
function ccNumValidator() {
  function formatCcNum(text) {
    const regex = /^(\d{4})(\d{4})(\d{4})(\d{1,4})$/;
    return text.replace(regex, '$1-$2-$3-$4');
  }

  ccNumber.addEventListener("blur", e => {
    e.target.value = formatCcNum(e.target.value);
  })

  let ccIsValid = /^(\d{4})(\d{4})(\d{4})(\d{1,4})|(\d{4})-(\d{4})-(\d{4})-(\d{1,4})$/.test(ccNumber.value);
  if (ccIsValid) {
    validationPass(ccNumber);
  } else {
    validationFail(ccNumber);
  }
  return ccIsValid;
};

function activityValidator() {
  for (let i = 0; i < checkBox.length; i++) {
    if (checkBox[i].checked) {
      validationPass(actBox);
      registerForActivities.lastElementChild.style.display = 'none';
      return true;
    }
  };
  validationFail(actBox);
  registerForActivities.lastElementChild.style.display = 'inherit';
  return false;
};

// Zipcod Validator - This zipcode is valid for my country Indonesia which is 5 digit zipcode //
function zipValidator() {
  let zipIsValid = /^\d{5}$/.test(ccZipCode.value);
  if (zipIsValid) {
    validationPass(ccZipCode);
  } else {
    validationFail(ccZipCode);
  }
  return zipIsValid;
};

// CVV Validator //
function cvvValidator() {
  let cvvIsValid = /^\d{3}$/.test(cvv.value);
  if (cvvIsValid) {
    validationPass(cvv);
  } else {
    validationFail(cvv);
  }
  return cvvIsValid;
};

// Function to show/hide tips for empty/incorrect fields
// Code taken & modified from previous Treehouse Validation exercise //
function showOrHideTip(show, element) {
  if (show) {
    element.style.display = "inherit";
  } else {
    element.style.display = "none";
  }
}

const createListener = (validator) => {
  return e => {
    const text = e.target.valid;
    const valid = validator(text);
    const showTip = text !== "" && !valid;
    const tooltip = e.target.nextElementSibling;
    showOrHideTip(showTip, tooltip);
  };
}; 

// Code inspired from previous Treehouse Validation exercise. Changed the listener to keyup for a more realistic response from an actual web //
userName.addEventListener('keyup', createListener(nameValidator));
userEmail.addEventListener('keyup', createListener(emailValidator));
ccNumber.addEventListener('keyup', createListener(ccNumValidator));
ccZipCode.addEventListener('keyup', createListener(zipValidator));
cvv.addEventListener('keyup', createListener(cvvValidator));


// Form submission - Some of the code here was taken & modified from Validation warmup exercise //
theForm.addEventListener("submit", (e) => {
  if (nameValidator() && emailValidator() && ccNumValidator() && zipValidator() && cvvValidator() && activityValidator()) {
    theForm.submit();
    console.log('Form Submitted, Payment: CC');
  } else {
    e.preventDefault()
  }

  if (userSelectedPayment.value === "paypal" && nameValidator()  && emailValidator() && activityValidator()) {
    theForm.submit();
    console.log('Form Submitted, Payment: PayPal');
  } else {
    e.preventDefault()
  }

  if (userSelectedPayment.value === "bitcoin" && nameValidator()  && emailValidator() && activityValidator()) {
    theForm.submit();
    console.log('Form Submitted, Payment: BitCoin');
  } else {
    e.preventDefault()
  }
});
