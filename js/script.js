const theName = document.querySelector('#name');
theName.focus();

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

const registerForActivities = document.querySelector('#activities');
const totalCost = document.querySelector('#activities-cost');
let totalCostSum = 0;

registerForActivities.addEventListener("change", (e) => {
  let dataCost = parseInt(e.target.getAttribute('data-cost'));
  if (e.target.checked) {
    totalCostSum += dataCost;
  } else {
    totalCostSum -= dataCost;
  }
  totalCost.innerHTML = `Total: $${totalCostSum}`
})