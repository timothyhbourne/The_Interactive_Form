const userName = document.querySelector('#name');
userName.focus();

// Job Role Section //
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

// T-Shirt Info Section //
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

// Activity Section //
const registerForActivities = document.querySelector('#activities');
const totalCost = document.querySelector('#activities-cost');
const actBox = document.querySelector('#activities-box');
const actLabel = actBox.querySelectorAll('label')

console.log(actBox);
console.log(actLabel);

// for (let i = 0; i < actBox.length; i++) {
//   console.log(actInput);
// }

/* 
  if activities input checkbox is checked, add class name to the label
  for (let i = 0; i < activitiesLabel.length; i++) {

  }
  if (activitiesInput.checked)
  activitiesLabel.classList.add('focus');
*/

let totalCostSum = 0;

registerForActivities.addEventListener("change", (e) => {
  let dataCost = parseInt(e.target.getAttribute('data-cost'));
  if (e.target.checked) {
    totalCostSum += dataCost;
  } else {
    totalCostSum -= dataCost;
  }
  totalCost.innerHTML = `Total: $${totalCostSum}`;

})

// Payment Section //
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

// Form Validation Section //
const userEmail = document.querySelector('#email');
const ccNumber = document.querySelector('#cc-num');
const ccZipCode = document.querySelector('#zip');
const cvv = document.querySelector('#cvv')
const theForm = document.querySelector('form');

theForm.addEventListener("submit", (e) => {
  let userNameInput = userName.value;
  let nameRegex = /^[A-Za-z]+$/;
  let userNameTest = nameRegex.test(userNameInput)

  let userEmailInput = userEmail.value;
  let emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  let userEmailTest = emailRegex.test(userEmailInput);

  let ccNumberInput = ccNumber.value;
  let ccNumberRegex = /^(\d{4})(\d{4})(\d{4})(\d{0,4})$/;
  let ccNumberTest = ccNumberRegex.test(ccNumberInput);

  let ccZipCodeInput = ccZipCode.value;
  let ccZipCodeRegex = /^\d{5}$/;
  let ccZipCodeTest = ccZipCodeRegex.test(ccZipCodeInput);

  let cvvInput = cvv.value;
  let cvvRegex = /^\d{3}$/;
  let cvvTest = cvvRegex.test(cvvInput);

  if (userNameTest && userEmailTest && ccNumberTest && ccZipCodeTest && cvvTest) {
    theForm.submit();
  } else {
    e.preventDefault();
  }
})