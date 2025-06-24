// ---------------------------
// CONFIG
// ---------------------------

// LocalStorage keys
const SIGNED_IN_KEY = "signedInPeople";
const LAST_RESET_KEY = "lastResetDate";

// Daily reset time (24h format)
// E.g., 6 means reset at 6:00 AM local time
const RESET_HOUR = 4;

// ---------------------------
// DATA HELPERS
// ---------------------------

// Load signed in people from localStorage
function loadSignedInPeople() {
  return JSON.parse(localStorage.getItem(SIGNED_IN_KEY)) || [];
}

// Save signed in people to localStorage
function saveSignedInPeople(people) {
  localStorage.setItem(SIGNED_IN_KEY, JSON.stringify(people));
}

// ---------------------------
// DAILY RESET LOGIC
// ---------------------------

// Check if daily reset is needed at specified hour
function checkTimedReset() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const lastReset = localStorage.getItem(LAST_RESET_KEY);

  if (lastReset !== today && now.getHours() >= RESET_HOUR) {
    localStorage.setItem(SIGNED_IN_KEY, JSON.stringify([]));
    localStorage.setItem(LAST_RESET_KEY, today);
    console.log(`✅ Timed reset done at ${now.toLocaleTimeString()}`);
  } else {
    console.log("No reset needed yet");
  }
}

// Run reset check immediately when app loads
checkTimedReset();

// ---------------------------
// UI ELEMENTS
// ---------------------------

const signInForm = document.getElementById("signInForm");
const signInNameInput = document.getElementById("signInName");
const signedInList = document.getElementById("signedInList");
const signOutSelect = document.getElementById("signOutSelect");

// ---------------------------
// UI HANDLERS
// ---------------------------

// Render the list of signed in people
function renderSignedInPeople() {
  const people = loadSignedInPeople();
  signedInList.innerHTML = "";
  signOutSelect.innerHTML = "";

  people.forEach((person, index) => {
    const li = document.createElement("li");
    li.textContent = `${person.name} - Signed in at ${new Date(person.timestamp).toLocaleTimeString()}`;
    signedInList.appendChild(li);

    const option = document.createElement("option");
    option.value = index;
    option.textContent = person.name;
    signOutSelect.appendChild(option);
  });
}

// Sign in handler
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = signInNameInput.value.trim();
  if (name === "") return;

  const people = loadSignedInPeople();
  people.push({
    name,
    timestamp: new Date().toISOString(),
  });
  saveSignedInPeople(people);
  signInNameInput.value = "";
  renderSignedInPeople();
});

// Sign out handler
document.getElementById("signOutButton").addEventListener("click", () => {
  const index = signOutSelect.value;
  const people = loadSignedInPeople();
  if (people.length > 0 && index !== "") {
    people.splice(index, 1);
    saveSignedInPeople(people);
    renderSignedInPeople();
  }
});

// ---------------------------
// INIT
// ---------------------------

renderSignedInPeople();
