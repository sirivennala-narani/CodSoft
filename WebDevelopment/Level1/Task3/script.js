const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const clear = document.getElementById("clear");
const equals = document.getElementById("equals");

let currentInput = "";
let resultDisplayed = false;


buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");

    
    if (!value) return;

    if (resultDisplayed && !isNaN(value)) {
      currentInput = "";
      resultDisplayed = false;
    }

    currentInput += value;
    display.textContent = currentInput;
  });
});


clear.addEventListener("click", () => {
  currentInput = "";
  display.textContent = "0";
});

equals.addEventListener("click", () => {
  try {
    const result = eval(currentInput);
    display.textContent = result;
    currentInput = result.toString();
    resultDisplayed = true;
  } catch (error) {
    display.textContent = "Error";
    currentInput = "";
  }
});

