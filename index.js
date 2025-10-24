document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("login-link");
  const errorMessage = document.getElementById("error-message");

  loginLink.addEventListener("click", function (event) {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
      event.preventDefault(); // stop navigation
      errorMessage.textContent = "⚠️ Please fill in all required fields!";
    } else {
      errorMessage.textContent = ""; // clear error
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  const errorMessage = document.getElementById("error-message");
  const registerLink = document.getElementById("register-link");

  registerLink.addEventListener("click", function (event) {
    // stop link from going to payment.html right away
    event.preventDefault();

    //Check empty fields
    if (email.value.trim() === "" || password.value.trim() === "" || confirmPassword.value.trim() === "") {
      errorMessage.textContent = "⚠️ All fields are required!";
      return;
    }
else{
    //Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      errorMessage.textContent = "⚠️ Please enter a valid email address!";
      return;
    }

    //Check password match
    if (password.value !== confirmPassword.value) {
      errorMessage.textContent = "⚠️ Passwords do not match!";
      return;
    }

    // If all good → go to payment.html
    errorMessage.textContent = "";
    window.location.href = registerLink.getAttribute("href");
  }
});
});

// for microphone in game page
document.addEventListener("DOMContentLoaded", () => {
  const textBox = document.getElementById('textBox');
  const micToggle = document.getElementById('micToggle');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition API");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  let isMicOn = false;

  micToggle.addEventListener('click', () => {
    if (!isMicOn) {
      recognition.start();
      micToggle.textContent = "Turn Off Microphone";
      isMicOn = true;
    } else {
      recognition.stop();
      micToggle.textContent = "Turn On Microphone";
      isMicOn = false;
    }
  });

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    textBox.value = transcript;
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
});


// right side
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const textBox = document.getElementById("textBox");
  const sendBtn = document.getElementById("send-btn");
  const chatArea = document.getElementById("chat-area");
  const micToggle = document.getElementById("micToggle");

  // Player name and conversation step
  let playerName = "";
  let step = 0;

  // Speech Recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;
  let isMicOn = false;

  if (!SpeechRecognition) {
    micToggle.disabled = true;
    micToggle.textContent = "Mic not supported";
  } else {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      textBox.value = transcript;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    micToggle.addEventListener("click", () => {
      if (!isMicOn) {
        recognition.start();
        micToggle.textContent = "Turn Off Microphone";
        isMicOn = true;
      } else {
        recognition.stop();
        micToggle.textContent = "Turn On Microphone";
        isMicOn = false;
      }
    });
  }

  // Helper functions to add messages
  function addEsmereldaMessage(msg) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble esmerelda";
    bubble.textContent = msg;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function addClientMessage(msg) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble client";
    bubble.innerHTML = `<strong>${playerName || "You"}</strong><br>${msg}`;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Conversation flow handler
  function handleUserInput(input) {
    if (step === 0) {
      // Initial greeting - actually start automatically below
      return;
    } else if (step === 1) {
      // Get player name
      playerName = input;
      addEsmereldaMessage(`Nice to meet you, ${playerName}!`);
      addEsmereldaMessage("Would you like a tutorial first, or start the game?");
      addEsmereldaMessage("Type 'tutorial' or 'start'.");
      step = 2;
    } else if (step === 2) {
      if (input.toLowerCase().includes("tutorial")) {
        addEsmereldaMessage("Great! Starting the tutorial...");
        addEsmereldaMessage("1. Use arrow keys to move.");
        addEsmereldaMessage("2. Press 'A' to attack.");
        addEsmereldaMessage("3. Collect items to improve your stats.");
        addEsmereldaMessage("Type 'start' when you are ready to begin the game.");
        step = 3;
      } else if (input.toLowerCase().includes("start")) {
        addEsmereldaMessage("Alright! Starting the game...");
        step = 4;
        // Add your game start logic here
      } else {
        addEsmereldaMessage("Please type 'tutorial' or 'start' to continue.");
      }
    } else if (step === 3) {
      if (input.toLowerCase().includes("start")) {
        addEsmereldaMessage("Great! Let's begin the adventure!");
        step = 4;
        // Add your game start logic here
      } else {
        addEsmereldaMessage("Type 'start' when you are ready to begin the game.");
      }
    }
  }

  // Send button click
  sendBtn.addEventListener("click", () => {
    const input = textBox.value.trim();
    if (!input) return;

    addClientMessage(input);
    handleUserInput(input);

    textBox.value = "";
  });

  // Enter key sends message (except Shift+Enter for newline)
  textBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // Automatically start the conversation
  function startConversation() {
    addEsmereldaMessage("Hi! My name is Esmerelda.");
    addEsmereldaMessage("You’re going to play an adventure game with me.");
    addEsmereldaMessage("But before we start, may I know your name?");
    step = 1;
  }

  startConversation();
});
