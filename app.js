// ---------------------------
// CONFIG
// ---------------------------

const SIGNED_IN_KEY = "signedInPeople";
const LAST_RESET_KEY = "lastResetDate";
const RESET_HOUR = 6; // Daily reset hour

// ---------------------------
// DATA HELPERS
// ---------------------------

function loadSignedInPeople() {
  return JSON.parse(localStorage.getItem(SIGNED_IN_KEY)) || [];
}

function saveSignedInPeople(people) {
  localStorage.setItem(SIGNED_IN_KEY, JSON.stringify(people));
}

function checkTimedReset() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const lastReset = localStorage.getItem(LAST_RESET_KEY);

  if (lastReset !== today && now.getHours() >= RESET_HOUR) {
    localStorage.setItem(SIGNED_IN_KEY, JSON.stringify([]));
    localStorage.setItem(LAST_RESET_KEY, today);
    console.log(`✅ Timed reset done at ${now.toLocaleTimeString()}`);
  }
}

checkTimedReset();

// ---------------------------
// TOAST UTILITY
// ---------------------------

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");

  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2000);
}

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

function renderSignedInPeople() {
  const people = loadSignedInPeople();
  signedInList.innerHTML = "";
  signOutSelect.innerHTML = '<option value="">Select name to sign out</option>';

  people.forEach((person, index) => {
    const li = document.createElement("li");
    li.textContent = `${person.name} - ${new Date(person.timestamp).toLocaleTimeString()}`;
    li.className = "bg-white dark:bg-gray-700 p-3 rounded-lg shadow transition-opacity duration-500 opacity-0";
    signedInList.appendChild(li);

    // Fade in effect
    setTimeout(() => {
      li.classList.remove("opacity-0");
      li.classList.add("opacity-100");
    }, 10);

    const option = document.createElement("option");
    option.value = index;
    option.textContent = person.name;
    signOutSelect.appendChild(option);
  });
}

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
  showToast(`✅ ${name} signed in`);
});

document.getElementById("signOutButton").addEventListener("click", () => {
  const index = signOutSelect.value;
  const people = loadSignedInPeople();
  if (people.length > 0 && index !== "") {
    const [removed] = people.splice(index, 1);
    saveSignedInPeople(people);
    renderSignedInPeople();
    showToast(`🚪 ${removed.name} signed out`);
  }
});

// ---------------------------
// INIT
// ---------------------------

renderSignedInPeople();
