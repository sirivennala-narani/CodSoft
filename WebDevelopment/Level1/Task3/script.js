const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const clear = document.getElementById("clear");
const equals = document.getElementById("equals");

let currentInput = "";
let resultDisplayed = false;

// Handle number and operator buttons
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");

    // Ignore clicks on buttons without data-value (like C or =)
    if (!value) return;

    // Reset display after result
    if (resultDisplayed && !isNaN(value)) {
      currentInput = "";
      resultDisplayed = false;
    }

    currentInput += value;
    display.textContent = currentInput;
  });
});

// Clear the display
clear.addEventListener("click", () => {
  currentInput = "";
  display.textContent = "0";
});

// Evaluate the expression
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
