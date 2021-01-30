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
let checkedActivities = 0;
const registerForActivities = document.querySelector('#activities');
const activitiesHint = document.querySelector('#activities-hint')
const totalCost = document.querySelector('#activities-cost');
const actBox = document.querySelector('#activities-box');
const checkBox = actBox.querySelectorAll('input[type="checkbox"]');

for (let i = 0; i < checkBox.length; i++) {
  checkBox[i].addEventListener('focus', (e) => {
    e.target.parentElement.classList.add('focus');
  });
  checkBox[i].addEventListener('blur', (e) => {
    e.target.parentElement.classList.remove('focus');
  });
}

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
      checkedActivities += 1; 
      label.classList.add('focus');
    } else {
      label.classList.remove('focus');
      checkedActivities -= 1;
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

  let ccIsValid = /^(\d{4})(\d{4})(\d{4})(\d{1,4})$|^(\d{4})-(\d{4})-(\d{4})-(\d{1,4})$/.test(ccNumber.value);
  if (ccIsValid) {
    validationPass(ccNumber);
  } else {
    validationFail(ccNumber);
  }
  return ccIsValid;
};

function activityValidator() {
  // for (let i = 0; i < checkBox.length; i++) {
  //   if (checkBox[i].checked) {
  //     validationPass(actBox.parentNode);
  //     activitiesHint.style.display = 'none';
  //     return true;
  //   }
  // };
  // validationFail(actBox.parentNode);
  // activitiesHint.style.display = 'block';
  // return false;
  for (let i = 0; i < checkBox.length; i++) {
      if (checkBox[i].checked) { 
        validationPass(actBox);
        return true
      }
  }
  validationFail(actBox);
  actBox.parentNode.classList.add('not-valid');
  return false;
};

// Zipcode Validator //
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

// Submits form, checks for errors. Will not submit if some inputs are invalid. 
theForm.addEventListener('submit', (e) => {
  if (!nameValidator()) {
      e.preventDefault();
      validationFail(userName)
  } else {
      validationPass(userName)
  }
  if (!emailValidator()) {
      e.preventDefault();
      validationFail(userEmail)
  } else {
      validationPass(userEmail)
  }

  if (checkedActivities === 0) {
      e.preventDefault();
      activitiesHint.style.display = 'block';
      activityValidator();
  } else {
      activitiesHint.style.display = 'none';
      activityValidator();
  }

  if (userSelectedPayment.value === 'credit-card') {
    let check = 0;
    if (!ccNumValidator()) {
      e.preventDefault();
      validationFail(ccNumber)
    } else {
      validationPass(ccNumber)
      check += 1;
    }
    if (!zipValidator()) {
      e.preventDefault();
      validationFail(ccZipCode)
    } else {
      validationPass(ccZipCode)
      check += 1;
    }
    if (!cvvValidator()) {
      e.preventDefault();
      validationFail(cvv)
    } else {
      validationPass(cvv);
      check += 1;
    };
    if (check === 3 && nameValidator() && emailValidator() && activityValidator()) {
      theForm.submit();
    } else {
      e.preventDefault()
    }
  }
  
  if (userSelectedPayment.value === "paypal" && nameValidator() && emailValidator() && activityValidator()) {
    theForm.submit();
    console.log('Form Submitted, Payment: PayPal');
  } else {
    e.preventDefault();
  }

  if (userSelectedPayment.value === "bitcoin" && nameValidator() && emailValidator() && activityValidator()) {
    theForm.submit();
    console.log('Form Submitted, Payment: BitCoin');
  } else {
    e.preventDefault();
  }
});