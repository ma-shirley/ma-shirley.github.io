// created with ChatGPT o1 preview
// Initialize variables
let countdownElement = document.getElementById('countdown');
let messageElement = document.getElementById('message');
let roundNumberElement = document.getElementById('round-number');
let newGameButton = document.getElementById('new-game');
let numPlayersInput = document.getElementById('num-players');
let startGameButton = document.getElementById('start-game');
let gameContainer = document.getElementById('game');
let setupContainer = document.getElementById('setup');

let x; // Decrement rate
let countdownTime;
let countdownInterval;
let countdownVisible;
let gameActive;

let players = []; // Array to store player data
let numPlayers = 2; // Default number of players
let winningScore = 3; // Number of rounds a player needs to win the game

let roundNumber = 1;
let maxRounds = 5;

let hideTime;

// Event listeners
startGameButton.addEventListener('click', setupGame);
newGameButton.addEventListener('click', () => {
  setupContainer.style.display = 'block';
  gameContainer.style.display = 'none';
});

function setupGame() {
  numPlayers = parseInt(numPlayersInput.value);

  if (numPlayers < 2 || numPlayers > 10) {
    alert('Please enter a number of players between 2 and 10.');
    return;
  }

  // Hide setup and show game container
  setupContainer.style.display = 'none';
  gameContainer.style.display = 'block';

  // Initialize players
  initializePlayers();

  // Start the game
  startNewGame();
}

function initializePlayers() {
  players = []; // Reset players array
  let playerButtonsContainer = document.getElementById('player-buttons');
  playerButtonsContainer.innerHTML = ''; // Clear any existing buttons

  let scoresContainer = document.getElementById('scores');
  scoresContainer.innerHTML = ''; // Clear existing scores

  for (let i = 1; i <= numPlayers; i++) {
    // Create player object
    let player = {
      id: i,
      name: `Player ${i}`,
      button: null,
      time: null,
      score: 0
    };

    // Create button element
    let button = document.createElement('button');
    button.id = `player${i}`;
    button.textContent = player.name;
    button.style.fontSize = '24px';
    button.style.padding = '10px 20px';
    button.style.margin = '10px';
    button.addEventListener('click', () => playerClick(player));

    // Assign button to player object
    player.button = button;

    // Add button to the container
    playerButtonsContainer.appendChild(button);

    // Add player to players array
    players.push(player);

    // Create score display
    let scoreSpan = document.createElement('span');
    scoreSpan.id = `player${i}-score`;
    scoreSpan.textContent = `${player.name} Score: 0`;
    scoreSpan.style.marginRight = '15px';

    // Add score to scores container
    scoresContainer.appendChild(scoreSpan);
  }
}

function startNewGame() {
  // Reset scores and round
  roundNumber = 1;
  players.forEach(player => {
    player.score = 0;
  });
  updateScores();

  // Hide New Game button
  newGameButton.style.display = 'none';

  // Reset and start first round
  resetRound();
}

function resetRound() {
  // Reset variables
  x = Math.random() * (5000 - 0.5) + 0.5; // Random number between 0.5 and 5000
  countdownTime = (Math.random()*5+5)*x; // Starting countdown time in seconds
  countdownVisible = true;
  gameActive = true;
  messageElement.textContent = '';
  countdownElement.textContent = countdownTime.toFixed(1);

  // Update round number in UI
  roundNumberElement.textContent = roundNumber;

  // For hiding the countdown at a random time
  hideTime = Math.max(countdownTime- (5+2*Math.random())*x, 2*x);

  // Reset players
  players.forEach(player => {
    player.time = null;
    player.button.disabled = true;
    player.button.style.display = 'inline-block';
    player.button.classList.remove('explode');
  });

  // Restart countdown
  clearInterval(countdownInterval);
  startCountdown();
}

function startCountdown() {
  countdownInterval = setInterval(updateCountdown, 100); // Update every 100ms
}

function updateCountdown() {
  if (!gameActive) return;

  // Decrease countdown by x per second, adjusted for 100ms interval
  countdownTime -= x * 0.1;
  countdownTime = Math.max(0, countdownTime); // Prevent negative time

  // Update countdown display
  countdownElement.textContent = countdownVisible ? countdownTime.toFixed(1) : '';

  // Hide the countdown at the hideTime
  if (countdownTime <= hideTime && countdownVisible) {
    countdownVisible = false;
        // Reset players
    players.forEach(player => {
        player.button.disabled = false;
    });
    
  }

  // Check if time has run out
  if (countdownTime <= 0) {
    endGame();
  }
}

function playerClick(player) {
  if (!gameActive) return;

  let currentTime = countdownTime;

  // Disallow clicks after time has run out
  if (currentTime <= 0) {
    messageElement.textContent = `${player.name}, time's up!`;
    return;
  }

  // Record the player's time
  if (player.time === null) {
    player.time = currentTime;
    player.button.disabled = true;
    console.log(player.id)
  }

  // Check if all players have clicked
  let allClicked = players.every(p => p.time !== null || p.button.disabled);

  if (allClicked) {
    determineWinner();
  }
}

function determineWinner() {
  gameActive = false;
  clearInterval(countdownInterval);

  // Filter out players who didn't press the button
  let activePlayers = players.filter(player => player.time !== null);

  if (activePlayers.length === 0) {
    // No one pressed the button
    messageElement.textContent = 'No one pressed the button in time. No one wins this round.';
  } else if (activePlayers.length === 1) {
    // Only one player pressed the button
    let winner = activePlayers[0];
    winner.score++;
    messageElement.textContent = `${winner.name} wins this round by default!`;
  } else {
    // Multiple players pressed the button
    // Determine who clicked closest to zero without going over
    activePlayers.sort((a, b) => a.time - b.time); // Sort ascending by time remaining
    let winner = activePlayers[0];
    winner.score++;
    messageElement.textContent = `${winner.name} wins this round!`;
  }

  // Update scores in UI
  updateScores();

  // Check if any player has won the game
  let gameWinner = players.find(player => player.score === winningScore);

  if (gameWinner) {
    messageElement.textContent += ` ${gameWinner.name} wins the game!`;
    endGame(true);
  } else if (roundNumber >= maxRounds) {
    // Maximum rounds reached, determine overall winner
    let highestScore = Math.max(...players.map(p => p.score));
    let winners = players.filter(p => p.score === highestScore);

    if (winners.length === 1) {
      messageElement.textContent += ` ${winners[0].name} wins the game!`;
    } else {
      messageElement.textContent += ' The game ends in a tie!';
    }
    endGame(true);
  } else {
    // Proceed to next round after a short delay
    setTimeout(() => {
      roundNumber++;
      resetRound();
    }, 3000);
  }
}

function endGame(gameWon = false) {
  gameActive = false;
  clearInterval(countdownInterval);

  // Add explosion effect to unpressed buttons
  players.forEach(player => {
    if (player.time === null) {
      explodeButton(player.button);
    }
  });

  if (!gameWon) {
    messageElement.textContent = 'Time is up!';

    // Determine if any players pressed the button
    let activePlayers = players.filter(player => player.time !== null);

    if (activePlayers.length === 1) {
      // Only one player pressed the button
      let winner = activePlayers[0];
      winner.score++;
      messageElement.textContent += ` ${winner.name} wins this round by default!`;

      // Check if player has won the game
      if (winner.score === winningScore) {
        messageElement.textContent += ` ${winner.name} wins the game!`;
        endGame(true);
        return;
      }
    } else if (activePlayers.length > 1) {
      // Multiple players pressed the button
      determineWinner();
      return;
    } else {
      // No players pressed the button
      messageElement.textContent += ' No one wins this round.';
    }

    // Proceed to next round after a short delay
    setTimeout(() => {
      roundNumber++;
      resetRound();
    }, 3000);
  } else {
    // Game has been won
    // Disable all buttons
    players.forEach(player => {
      player.button.disabled = true;
    });

    // Show New Game button
    newGameButton.style.display = 'inline-block';
  }
}

function explodeButton(button) {
  button.classList.add('explode');
  button.disabled = true;

  // Remove the button after the animation
  setTimeout(() => {
    button.style.display = 'none';
  }, 1000);
}

function updateScores() {
  players.forEach(player => {
    let scoreSpan = document.getElementById(`player${player.id}-score`);
    scoreSpan.textContent = `${player.name} Score: ${player.score}`;
  });
}

// Show the rules modal when the page loads
window.onload = function() {
  showRulesModal();
};

function showRulesModal() {
  let modal = document.getElementById('rules-modal');
  let closeBtn = document.getElementById('close-modal');
  let dontShowAgainCheckbox = document.getElementById('dont-show-again');

  // Check if the user has previously chosen not to show the modal
  if (localStorage.getItem('dontShowRules') === 'true') {
    return; // Do not show the modal
  }

  modal.style.display = 'block';

  closeBtn.onclick = function() {
    modal.style.display = 'none';
    if (dontShowAgainCheckbox.checked) {
      localStorage.setItem('dontShowRules', 'true');
    }
  };

  // Close the modal when clicking outside of the modal content
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      if (dontShowAgainCheckbox.checked) {
        localStorage.setItem('dontShowRules', 'true');
      }
    }
  };
}
