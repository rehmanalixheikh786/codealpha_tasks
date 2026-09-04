/* 
================================================================================================
Calculator — script.js
Builds a token-based expression (numbers + operators), evaluates it with
correct * / precedence over + -, and supports mouse + keyboard input.
No eval() is used anywhere.
================================================================================================ 
*/

// ---------------------------------------------------------------------------
// 1. DOM REFERENCES
// ---------------------------------------------------------------------------
const expressionEl = document.getElementById("expression");
const currentEl = document.getElementById("current");
const keypad = document.querySelector(".keypad");
const themeToggle = document.getElementById("themeToggle");

/* 
================================================================================================
STATE
================================================================================================ 
*/
let tokens = []; // finalized tokens, e.g. ["5", "+", "3"]
let currentOperand = "0"; // the number currently being typed
let justEvaluated = false; // true right after "=" was pressed
let hasError = false; // true after a division-by-zero / bad input

const OPERATOR_SYMBOLS = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};
const OPERATOR_MATH = { add: "+", subtract: "-", multiply: "*", divide: "/" };

/* 
================================================================================================
DISPLAY FORMATTING
Adds thousand separators to the integer part without touching the decimal
part the user is actively typing (so "1234.5" stays exactly as typed).
================================================================================================ 
*/
function formatNumberForDisplay(numStr) {
  if (numStr === "" || numStr === "-") return numStr;

  const negative = numStr.startsWith("-");
  const unsigned = negative ? numStr.slice(1) : numStr;
  const [intPart, decPart] = unsigned.split(".");

  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let result = (negative ? "-" : "") + groupedInt;
  if (decPart !== undefined) result += "." + decPart;

  return result;
}

/* 
================================================================================================
Renders a single token for the small expression line above the display.
================================================================================================ 
*/
function formatToken(token) {
  if (token === "+") return "+";
  if (token === "-") return "−";
  if (token === "*") return "×";
  if (token === "/") return "÷";
  return formatNumberForDisplay(token);
}

/* 
================================================================================================
RENDER
================================================================================================ 
*/
function updateDisplay() {
  expressionEl.textContent = tokens.map(formatToken).join(" ");
  currentEl.textContent = hasError
    ? "Error"
    : formatNumberForDisplay(currentOperand);
  currentEl.classList.toggle("is-error", hasError);

  /* 
================================================================================================
Highlight the most recent operator key while it's "pending"
================================================================================================ 
*/
  document
    .querySelectorAll(".key-op")
    .forEach((btn) => btn.classList.remove("is-active"));
  const lastToken = tokens[tokens.length - 1];
  if (
    !hasError &&
    typeof lastToken === "string" &&
    "+-*/".includes(lastToken) &&
    currentOperand === ""
  ) {
    const opName = Object.keys(OPERATOR_MATH).find(
      (key) => OPERATOR_MATH[key] === lastToken,
    );
    const btn = document.querySelector(`.key-op[data-action="${opName}"]`);
    if (btn) btn.classList.add("is-active");
  }
}

/* 
================================================================================================
EVALUATION (no eval() — manual two-pass precedence resolution)
Pass 1 resolves all * and / left-to-right.
Pass 2 resolves the remaining + and - left-to-right.
================================================================================================ 
*/
function evaluate(rawTokens) {
  const values = [];
  const ops = [];

  // Pass 1: multiply / divide
  let i = 0;
  while (i < rawTokens.length) {
    const token = rawTokens[i];
    if (token === "*" || token === "/") {
      const prev = values.pop();
      const next = parseFloat(rawTokens[i + 1]);
      let result;
      if (token === "*") {
        result = prev * next;
      } else {
        if (next === 0) throw new Error("DIV_BY_ZERO");
        result = prev / next;
      }
      values.push(result);
      i += 2;
    } else if (token === "+" || token === "-") {
      ops.push(token);
      i += 1;
    } else {
      values.push(parseFloat(token));
      i += 1;
    }
  }

  /* 
================================================================================================
 Pass 2: add / subtract, left to right
================================================================================================ 
*/
  let result = values[0];
  for (let j = 0; j < ops.length; j++) {
    const nextVal = values[j + 1];
    result = ops[j] === "+" ? result + nextVal : result - nextVal;
  }

  if (!isFinite(result)) throw new Error("DIV_BY_ZERO");
  return result;
}

/* 
================================================================================================
INPUT HANDLERS
================================================================================================ 
*/
function inputDigit(digit) {
  if (hasError) clearAll();
  if (justEvaluated) {
    tokens = [];
    currentOperand = "0";
    justEvaluated = false;
  }
  if (currentOperand === "0") {
    currentOperand = digit;
  } else if (currentOperand.replace("-", "").replace(".", "").length < 15) {
    /* 
================================================================================================
Cap length so the display never has to render an absurdly long number
================================================================================================ 
*/
    currentOperand += digit;
  }
}

function inputDecimal() {
  if (hasError) clearAll();
  if (justEvaluated) {
    tokens = [];
    currentOperand = "0";
    justEvaluated = false;
  }
  if (!currentOperand.includes(".")) {
    currentOperand += ".";
  }
}

function chooseOperator(action) {
  if (hasError) return;
  const symbol = OPERATOR_MATH[action];

  if (justEvaluated) {
    /* 
================================================================================================
Continue calculating from the previous result: e.g. "10" then "×2"
================================================================================================ 
*/
    tokens = [currentOperand, symbol];
    currentOperand = "";
    justEvaluated = false;
    updateDisplay();
    return;
  }

  if (currentOperand === "" && tokens.length > 0) {
    /* 
================================================================================================
User is swapping the operator (e.g. pressed + then changed to ×)
================================================================================================ 
*/

    tokens[tokens.length - 1] = symbol;
    updateDisplay();
    return;
  }

  if (currentOperand === "" && tokens.length === 0) return;

  tokens.push(currentOperand);
  tokens.push(symbol);
  currentOperand = "";
}

function calculate() {
  if (hasError) return;
  if (currentOperand === "" && tokens.length === 0) return;

  const fullTokens =
    currentOperand !== "" ? [...tokens, currentOperand] : [...tokens];
  if (fullTokens.length === 0) return;

  try {
    const result = evaluate(fullTokens);
    /* 
================================================================================================
Round tiny floating point artifacts (e.g. 0.1 + 0.2) without truncating real precision
================================================================================================ 
*/
    const cleaned = Math.round((result + Number.EPSILON) * 1e10) / 1e10;
    tokens = [];
    currentOperand = String(cleaned);
    justEvaluated = true;
  } catch (err) {
    /* 
================================================================================================
Covers division by zero and any unexpected math error
================================================================================================ 
*/
    hasError = true;
    tokens = [];
    currentOperand = "0";
  }
}

function clearAll() {
  tokens = [];
  currentOperand = "0";
  justEvaluated = false;
  hasError = false;
}

function deleteLast() {
  if (hasError) {
    clearAll();
    return;
  }
  if (justEvaluated) {
    clearAll();
    return;
  }

  if (currentOperand.length > 0) {
    currentOperand = currentOperand.slice(0, -1);
  }
  if (currentOperand === "" || currentOperand === "-") {
    currentOperand = "0";
  }
}

function inputPercent() {
  if (hasError) return;
  const value = parseFloat(currentOperand || "0");
  currentOperand = String(value / 100);
}

function toggleSign() {
  if (hasError) return;
  if (currentOperand === "" || currentOperand === "0") return;
  currentOperand = currentOperand.startsWith("-")
    ? currentOperand.slice(1)
    : "-" + currentOperand;
}

/* 
================================================================================================
EVENT WIRING — mouse / touch
================================================================================================ 
*/

keypad.addEventListener("click", (event) => {
  const btn = event.target.closest(".key");
  if (!btn) return;

  handleKeyAction(btn);
  flashPress(btn);
});

function handleKeyAction(btn) {
  if (btn.dataset.num !== undefined) {
    inputDigit(btn.dataset.num);
    updateDisplay();
    return;
  }

  const action = btn.dataset.action;
  switch (action) {
    case "clear":
      clearAll();
      break;
    case "delete":
      deleteLast();
      break;
    case "percent":
      inputPercent();
      break;
    case "negate":
      toggleSign();
      break;
    case "decimal":
      inputDecimal();
      break;
    case "equals":
      calculate();
      break;
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      chooseOperator(action);
      break;
  }
  updateDisplay();
}

/* 
================================================================================================
Brief scale-down animation on press, mirrored for keyboard input.
================================================================================================ 
*/
function flashPress(btn) {
  btn.classList.add("is-pressed");
  setTimeout(() => btn.classList.remove("is-pressed"), 120);
}

/* 
================================================================================================
EVENT WIRING — keyboard
================================================================================================ 
*/

const KEY_TO_SELECTOR = {
  0: '[data-num="0"]',
  1: '[data-num="1"]',
  2: '[data-num="2"]',
  3: '[data-num="3"]',
  4: '[data-num="4"]',
  5: '[data-num="5"]',
  6: '[data-num="6"]',
  7: '[data-num="7"]',
  8: '[data-num="8"]',
  9: '[data-num="9"]',
  "+": '[data-action="add"]',
  "-": '[data-action="subtract"]',
  "*": '[data-action="multiply"]',
  "/": '[data-action="divide"]',
  ".": '[data-action="decimal"]',
  Enter: '[data-action="equals"]',
  "=": '[data-action="equals"]',
  Backspace: '[data-action="delete"]',
  Escape: '[data-action="clear"]',
  "%": '[data-action="percent"]',
};

document.addEventListener("keydown", (event) => {
  const selector = KEY_TO_SELECTOR[event.key];
  if (!selector) return;

  event.preventDefault();
  const btn = document.querySelector(selector);
  if (!btn) return;

  handleKeyAction(btn);
  flashPress(btn);
});

/* 
================================================================================================
THEME TOGGLE (light / dark)
================================================================================================ 
*/
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute(
    "aria-pressed",
    theme === "light" ? "true" : "false",
  );
  themeToggle.setAttribute(
    "aria-label",
    theme === "light" ? "Switch to dark mode" : "Switch to light mode",
  );
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

const prefersLight =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: light)").matches;
applyTheme(prefersLight ? "light" : "dark");

updateDisplay();
