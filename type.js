const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const timerDisplay = document.getElementById("timer");
const mistakesDisplay = document.getElementById("mistakes");
const startBtn = document.getElementById("start-test");
const stopBtn = document.getElementById("stop-test");
const restartBtn = document.getElementById("restart");
const resultBox = document.querySelector(".result");

let quote = "";
let timeLeft = 60;
let mistakes = 0;
let charIndex = 0;
let timer;
const correctSound = new Audio('correct-sound.mp3'); // Add the correct sound file
const incorrectSound = new Audio('incorrect-sound.mp3'); // Add the incorrect sound file

// Fetch and display a new quote
const renderNewQuote = async () => {
  const response = await fetch(quoteApiUrl);
  const data = await response.json();
  quote = data.content;
  quoteSection.innerHTML = "";
  quote.split("").forEach((char, idx) => {
    const span = document.createElement("span");
    span.innerText = char;
    span.classList.add("quote-chars");
    if (idx === 0) span.classList.add("current");
    quoteSection.appendChild(span);
  });
  charIndex = 0;
  mistakes = 0;
  userInput.value = "";
  mistakesDisplay.innerText = "0";
};

// Timer countdown function
const updateTimer = () => {
  if (timeLeft === 0) {
    clearInterval(timer);
    displayResult();
  } else {
    timeLeft--;
    timerDisplay.innerText = `${timeLeft}s`;
  }
};

// Start Timer
const startTimer = () => {
  timeLeft = 60;
  timerDisplay.innerText = `${timeLeft}s`;
  timer = setInterval(updateTimer, 1000);
};

// Start Test function
const startTest = () => {
  userInput.disabled = false;
  userInput.focus();
  renderNewQuote();
  startTimer();
  startBtn.style.display = "none";
  stopBtn.style.display = "inline-block";
  restartBtn.style.display = "inline-block";
};

// Compare input with quote and highlight
userInput.addEventListener("input", () => {
  const spans = document.querySelectorAll(".quote-chars");
  const inputChars = userInput.value.split("");

  if (charIndex < inputChars.length) {
    const currentChar = spans[charIndex];
    const typedChar = inputChars[charIndex];

    if (typedChar === currentChar.innerText) {
      currentChar.classList.add("success");
      correctSound.play(); // Play sound for correct input
    } else {
      currentChar.classList.add("fail");
      incorrectSound.play(); // Play sound for incorrect input
      mistakes++; // Increment mistakes
      mistakesDisplay.innerText = mistakes; // Update the displayed mistakes
    }

    charIndex++;
    if (charIndex < spans.length) {
      spans[charIndex].classList.add("current");
    }

    if (charIndex === quote.length) {
      displayResult();
    }
  }
});

// Display the result
const displayResult = () => {
  clearInterval(timer);
  const timeTaken = 60 - timeLeft;
  const wordsTyped = userInput.value.trim().split(/\s+/).length;
  const wpm = Math.round(wordsTyped / (timeTaken / 60));
  const accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);

  document.getElementById("wpm").innerText = wpm;
  document.getElementById("accuracy").innerText = accuracy + " %";
  resultBox.style.display = "block";
  stopBtn.style.display = "none";
};

// Restart the Test
const restartTest = () => {
  resultBox.style.display = "none";
  startBtn.style.display = "inline-block";
  stopBtn.style.display = "none";
  restartBtn.style.display = "none";
  userInput.disabled = true;
  mistakes = 0;
  mistakesDisplay.innerText = "0";
  timerDisplay.innerText = "60s";
  timeLeft = 60;
};

// Toggle Dark Mode
const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
  const mode = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
  document.getElementById("dark-mode-toggle").innerText = mode;
};

window.onload = () => {
  userInput.disabled = true;
  startBtn.style.display = "inline-block";
  stopBtn.style.display = "none";
  restartBtn.style.display = "none";
  timerDisplay.innerText = "60s";
};
