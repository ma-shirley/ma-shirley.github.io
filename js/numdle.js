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
  num = Math.floor(Math.random() * 9876 + 1);
}

let NUM_ANSWER = num.toString();

const WordEnum = {
  CORRECT: 1,
  ALMOST: 2,
  INCORRECT: 3,
};
const { CORRECT, ALMOST, INCORRECT } = WordEnum;

// HTML elements

const collection = document.querySelectorAll("#collection-row");
const messege = document.querySelector(".messege");
const popup = document.querySelector(".popup");
const virtualKeyboard = document.querySelector(".virtual-keyboard");
const correctbox = document.getElementsByClassName("correctbox");
const almostbox = document.getElementsByClassName("almostbox");

// Global state
let charArray = ["", "", "", ""];
let currentCharIdx = 0;
let guessCount = 0;
let showing_popup = false;

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
    collection[0].children[guessCount].children[currentCharIdx - 1].innerText = "";
    collection[0].children[guessCount].children[currentCharIdx - 1].classList.remove("new-border");
    charArray[currentCharIdx - 1] = "";
    currentCharIdx != 0 ? currentCharIdx-- : (currentCharIdx = 0);
  }
}

function renderResult(e) {
  const guess = charArray.join("");
  // Check if it is correct
  if (guess == NUM_ANSWER) {
    storage_key = (guessCount + 1).toString();
    cnt = parseInt(localStorage.getItem(storage_key));
    localStorage.setItem(storage_key, (cnt + 1).toString());
    // console.log(storage_key, cnt + 1);
    if (guessCount == 0) {
      messege.innerHTML = `<p class="bg-black border border-green-600 w-80 rounded text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-center messeges p-5 shadow">
      You won with just 1 attempt!  <br/>
      <button  onclick=location.reload() class='bg-white text-green-600 hover:text-green-800 hover:bg-gray-200 py-2 px-2 m-0.5 rounded w-50 cursor-pointer'>Play again</button>
      </p>`;
      currentCharIdx = 0;
    }
    else {
      messege.innerHTML = `<p class="bg-black border border-green-600 w-80 rounded text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-center messeges p-5 shadow">
                You won with ${guessCount + 1} attempts! <br/>
                <button  onclick=location.reload() class='bg-white text-green-600 hover:text-green-800 hover:bg-gray-200 py-2 px-2 m-0.5 rounded w-50 cursor-pointer'>Play again</button>
                </p>`;
      currentCharIdx = 0;
    }
    const result = checkNumber(guess, NUM_ANSWER);
    correctbox[guessCount].innerHTML = result[0];
    almostbox[guessCount].innerHTML = result[1];
  }
  else {
    const result = checkNumber(guess, NUM_ANSWER);
    correctbox[guessCount].innerHTML = result[0];
    almostbox[guessCount].innerHTML = result[1];
    guessCount != 9 ? guessCount++ : null;
    currentCharIdx = 0;

    if (guessCount == 9) {
      storage_key = "fail";
      cnt = parseInt(localStorage.getItem(storage_key));
      localStorage.setItem(storage_key, (cnt + 1).toString());
      messege.innerHTML = `<p class="bg-black border border-green-600 w-80 rounded text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-center messeges p-5 shadow">
                You lost :( <br/>
                <span class="text-white">The secret number is: <b>${num}</b><span/><br/>
                <button onclick=location.reload() class='restar  bg-white text-green-600 hover:text-green-800 hover:bg-gray-200 py-2 px-2 m-0.5 rounded w-50 cursor-pointer'>Play again</button>
                </p>`;
    }
  }
}

function resetAll(num = 1111) {
  while (!validAnswer(num)) {
    num = Math.floor(Math.random() * 9876 + 1);
  }
  NUM_ANSWER = num.toString();
  // console.log("HINT: the correct answer is: ", NUM_ANSWER);
  charArray = ["", "", "", ""];
  currentCharIdx = 0;
  guessCount = 0;
  for (let i = 0; i < 9; i++) {
    correctbox[i].innerHTML = "?";
    almostbox[i].innerHTML = "?";
    for (let j = 0; j < 4; j++) {
      collection[0].children[i].children[j].innerText = "";
    }
  }
  messege.innerHTML = "";

}

// Event handlers

function handleKeyPress(e) {
  if (e.keyCode >= 49 && e.keyCode <= 57) {
    addLetter(e);
  } else if (e.key === "Enter") {
    if (currentCharIdx == 4) {
      renderResult();
    }
  } else if (e.key === "Backspace") {
    removeLetter();
  }
  else if (e.key == "Restart") {
    resetAll(num = NUM_ANSWER);
  }
  else if (e.key == "Forget") {
    localStorage.setItem("1", "0");
    localStorage.setItem("2", "0");
    localStorage.setItem("3", "0");
    localStorage.setItem("4", "0");
    localStorage.setItem("5", "0");
    localStorage.setItem("6", "0");
    localStorage.setItem("7", "0");
    localStorage.setItem("8", "0");
    localStorage.setItem("9", "0");
    localStorage.setItem("fail", "0");
    localStorage.removeItem("visited");
    resetAll();
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
    };
  } else if (e.target.id == "forget") {
    return {
      keyCode: 14,
      key: "Forget",
    };
  }
  else {
    return {
      keyCode: e.target.innerHTML.charCodeAt(),
      key: String.fromCharCode(e.target.innerHTML.charCodeAt()).toLowerCase(),
    };
  }
}

function displayPopup(e) {
  if (!localStorage.getItem("visited")) {
    messege.innerHTML = `
      <p class="bg-white border border-green-600 w-80 rounded text-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg text-left messeges p-5 shadow">
      <b>How To Play</b>  <br/>
      Guess the number in 9 tries <br/>
      Answers have distinct digits in 1-9 <br/>
      &#10003 number &#10003 location => green <br/>
      &#10003 number &#x2715 location => yellow <br/>
      <br/>
      <b>Example</b> <br/>
      The number is 1234 <br/>
      <img src="img/numdle3.png">
      4 is in the number but in the wrong place <br/>
      <img src="img/numdle1.png">
      1 is in the right place <br/> 
      <img src="img/numdle2.png">
      Also, the guess doesn't have to have distinct digits <br/>
      <button  onclick="resetAll()" class='bg-white text-green-600 hover:text-green-800 hover:bg-gray-200 py-2 px-2 m-0.5 rounded w-50 cursor-pointer play-button'>Let's play!</button>
      </p>`;
  }
  localStorage.setItem("visited", "true");
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

window.addEventListener("load", function () {
  showing_popup = true;
  displayPopup();
});

window.addEventListener("click", function () {
  if (showing_popup) {
    showing_popup = false;
    resetAll();
  }
});

if (!localStorage.getItem("1")) {
  localStorage.setItem("1", "0");
  localStorage.setItem("2", "0");
  localStorage.setItem("3", "0");
  localStorage.setItem("4", "0");
  localStorage.setItem("5", "0");
  localStorage.setItem("6", "0");
  localStorage.setItem("7", "0");
  localStorage.setItem("8", "0");
  localStorage.setItem("9", "0");
  localStorage.setItem("fail", "0");
}

JSC.Chart('chartDiv', {
  type: 'vertical column',
  legend_visible: false,
  yAxis_visible: false,
  xAxis_label_text: "# of attempts",
  yAxis_label_text: "count",
  series: [
    {
      name: "games",
      palette: "bright",
      points: [
        { x: '1', y: parseInt(localStorage.getItem('1')) },
        { x: '2', y: parseInt(localStorage.getItem('2')) },
        { x: '3', y: parseInt(localStorage.getItem('3')) },
        { x: '4', y: parseInt(localStorage.getItem('4')) },
        { x: '5', y: parseInt(localStorage.getItem('5')) },
        { x: '6', y: parseInt(localStorage.getItem('6')) },
        { x: '7', y: parseInt(localStorage.getItem('7')) },
        { x: '8', y: parseInt(localStorage.getItem('8')) },
        { x: '9', y: parseInt(localStorage.getItem('9')) },
        { x: 'fail', y: parseInt(localStorage.getItem('fail')) },
      ]
    }
  ]
});