// Make guess
let num = Math.floor(Math.random() * 9876 + 1);

function validAnswer(num) {
  let s = String(num);
  let uniDigits = new Set();
  for (let c of s.split("")) {
    if (c == '0') {
      return false;
    }
    else {
      uniDigits.add(c);
    }
  }
  if (uniDigits.size == 4) {
    return true;
  }
}

while (!validAnswer(num)) {
  num = Math.floor(Math.random() * 9876 + 1)
}

const NUM_ANSWER = num.toString();
console.log("HINT: the correct answer is: ", NUM_ANSWER);

const WordEnum = {
  CORRECT: 1,
  ALMOST: 2,
  INCORRECT: 3,
};
const { CORRECT, ALMOST, INCORRECT } = WordEnum;

// HTML elements

const collection = document.querySelectorAll("#collection-row");
const messege = document.querySelector(".messege");
const virtualKeyboard = document.querySelector(".virtual-keyboard");
const correctbox = document.getElementsByClassName("correctbox");
const almostbox = document.getElementsByClassName("almostbox");

// Global state
let charArray = ["", "", "", ""];
let currentCharIdx = 0;
let guessCount = 0;


function checkNumber(guess, answer) {
  const ans = answer;
  const arr = [...guess];
  const map = [0, 0];
  let uniDigits = new Set();
  for (let c of ans.split("")) {
    uniDigits.add(c);
  }
  for (let i = 0; i <= 3; i++) {
    if (arr[i] == ans[i]) {
      map[0] = map[0] + 1;
    }
    else {
      if (uniDigits.has(arr[i])) {
        map[1] = map[1] + 1;
      }
    }
  }
  return map;
}


function addLetter(data) {
  if (currentCharIdx < 4) {
    charArray[currentCharIdx] = data.key;
    collection[0].children[guessCount].children[currentCharIdx].innerText =
      charArray[currentCharIdx].toUpperCase();
    collection[0].children[guessCount].children[currentCharIdx].classList.add(
      "new-border"
    );
    currentCharIdx++;
  }
}

function removeLetter() {
  if (currentCharIdx > 0) {
    collection[0].children[guessCount].children[currentCharIdx-1].innerText = "";
    collection[0].children[guessCount].children[currentCharIdx-1].classList.remove("new-border");
    charArray[currentCharIdx-1] = "";
    currentCharIdx != 0 ? currentCharIdx-- : (currentCharIdx = 0);
  }
}

function renderResult(e) {
  const guess = charArray.join("");
  // Check if it is correct
  if (guess == NUM_ANSWER) {
    messege.innerHTML = `<p class="bg-black border border-green-600 w-80 rounded text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-center messeges p-5 shadow">
                You win <br/>
                <button  onclick=location.reload() class='bg-white text-green-600 hover:text-green-800 hover:bg-gray-200 py-2 px-2 m-0.5 rounded w-50 cursor-pointer'>Play again</button>
                </p>`;
    currentCharIdx = 0;
  }

  const result = checkNumber(guess, NUM_ANSWER);
  correctbox[guessCount].innerHTML = result[0];
  almostbox[guessCount].innerHTML = result[1];
  guessCount != 9 ? guessCount++ : null;
  console.log(guessCount);
  currentCharIdx = 0;

  if (guessCount == 9) {
    messege.innerHTML = `<p class="bg-black border border-green-600 w-80 rounded text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-center messeges p-5 shadow">
                You lost <br/>
                <span class="text-white">The secret number is: <b>${num}</b><span/><br/>
                <button onclick=location.reload() class='restar  bg-white text-green-600 hover:text-green-800 hover:bg-gray-200 py-2 px-2 m-0.5 rounded w-50 cursor-pointer'>Play again</button>
                </p>`;
  }
}

// Event handlers

function handleKeyPress(e) {
  if (e.keyCode >= 49 && e.keyCode <= 57) {
    addLetter(e);
  } else if (e.key === "Enter") {
    renderResult();
  } else if (e.key === "Backspace") {
    removeLetter();
  }
  else if (e.key == "Restart") {
    charArray = ["", "", "", ""];
    currentCharIdx = 0;
    guessCount = 0;
    location.reload();
  }
}

function virtualToKeyCode(e) {
  if (e.target.id === "enter") {
    return {
      keyCode: 11,
      key: "Enter",
    };
  } else if (e.target.id === "delete") {
    return {
      keyCode: 12,
      key: "Backspace",
    };
  } else if (e.target.id == "restart") {
    return {
      keyCode: 13,
      key: "Restart",
    }
  }
  else {
    return {
      keyCode: e.target.innerHTML.charCodeAt(),
      key: String.fromCharCode(e.target.innerHTML.charCodeAt()).toLowerCase(),
    };
  }
}

// virtual keyabord
window.addEventListener("keydown", (e) => {
  handleKeyPress(e);
});

// Virtual: first row
virtualKeyboard.children[0].addEventListener("click", (e) => {
  handleKeyPress(virtualToKeyCode(e));
});
// Virtual: second row
virtualKeyboard.children[1].addEventListener("click", (e) => {
  handleKeyPress(virtualToKeyCode(e));
});
