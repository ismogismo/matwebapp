interface Problem {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
}

interface Score {
  correct: number;
  total: number;
}

let currentProblem: Problem;
let score: Score = { correct: 0, total: 0 };

function getSelectedOperators(): string[] {
  const ops: { id: string; symbol: string }[] = [
    { id: "op-add", symbol: "+" },
    { id: "op-sub", symbol: "-" },
    { id: "op-mul", symbol: "*" },
    { id: "op-div", symbol: "/" },
  ];

  return ops
    .filter((op) => (document.getElementById(op.id) as HTMLInputElement).checked)
    .map((op) => op.symbol);
}

function getDifficultyRange(): number {
  const radios = document.querySelectorAll<HTMLInputElement>(
    'input[name="difficulty"]'
  );

  for (const radio of radios) {
    if (radio.checked) {
      switch (radio.id) {
        case "diff-easy":
          return 10;
        case "diff-medium":
          return 50;
        case "diff-hard":
          return 100;
      }
    }
  }

  return 10;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(): Problem {
  const operators = getSelectedOperators();
  const range = getDifficultyRange();
  const operator = operators[randomInt(0, operators.length - 1)];

  let num1: number;
  let num2: number;
  let answer: number;

  switch (operator) {
    case "+":
      num1 = randomInt(0, range);
      num2 = randomInt(0, range);
      answer = num1 + num2;
      break;

    case "-":
      num1 = randomInt(0, range);
      num2 = randomInt(0, num1);
      answer = num1 - num2;
      break;

    case "*":
      num1 = randomInt(0, range);
      num2 = randomInt(0, range);
      answer = num1 * num2;
      break;

    case "/":
      num2 = randomInt(1, range);
      const multiplier = randomInt(1, range);
      num1 = num2 * multiplier;
      answer = num1 / num2;
      break;

    default:
      num1 = 0;
      num2 = 0;
      answer = 0;
  }

  return { num1, num2, operator, answer };
}

function displayProblem(problem: Problem): void {
  const display = document.getElementById("problem-display") as HTMLDivElement;
  display.textContent = `${problem.num1} ${problem.operator} ${problem.num2} = ?`;
}

function updateScoreDisplay(): void {
  const scoreDisplay = document.getElementById("score") as HTMLDivElement;
  const percentage =
    score.total === 0 ? 0 : Math.round((score.correct / score.total) * 100);
  scoreDisplay.textContent = `Score: ${score.correct} / ${score.total} (${percentage}%)`;
}

function resetScore(): void {
  score.correct = 0;
  score.total = 0;
  updateScoreDisplay();
}

function checkAnswer(): void {
  const input = document.getElementById("answer-input") as HTMLInputElement;
  const feedback = document.getElementById("feedback") as HTMLDivElement;
  const userAnswer = parseFloat(input.value);

  if (isNaN(userAnswer)) {
    return;
  }

  score.total++;

  feedback.classList.remove("correct", "incorrect");

  if (userAnswer === currentProblem.answer) {
    score.correct++;
    feedback.textContent = "Correct!";
    feedback.classList.add("correct");
  } else {
    feedback.textContent = `Incorrect. The answer was ${currentProblem.answer}.`;
    feedback.classList.add("incorrect");
  }

  updateScoreDisplay();
  input.value = "";

  setTimeout(() => {
    feedback.textContent = "";
    feedback.classList.remove("correct", "incorrect");
    currentProblem = generateProblem();
    displayProblem(currentProblem);
    input.focus();
  }, 1500);
}

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
  const answerInput = document.getElementById(
    "answer-input"
  ) as HTMLInputElement;

  submitBtn.addEventListener("click", checkAnswer);

  answerInput.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });

  const opCheckboxIds = ["op-add", "op-sub", "op-mul", "op-div"];

  for (const id of opCheckboxIds) {
    const checkbox = document.getElementById(id) as HTMLInputElement;
    checkbox.addEventListener("change", () => {
      const selected = getSelectedOperators();
      if (selected.length === 0) {
        checkbox.checked = true;
        return;
      }
      currentProblem = generateProblem();
      displayProblem(currentProblem);
    });
  }

  const diffRadios = document.querySelectorAll<HTMLInputElement>(
    'input[name="difficulty"]'
  );

  for (const radio of diffRadios) {
    radio.addEventListener("change", () => {
      resetScore();
      currentProblem = generateProblem();
      displayProblem(currentProblem);
    });
  }

  currentProblem = generateProblem();
  displayProblem(currentProblem);
  updateScoreDisplay();
});
