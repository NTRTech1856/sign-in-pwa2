// Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/a/macros/newtheatreroyal.com/s/AKfycbxi66J5a9g2GZ8gAVa7anT5Yi2V270VpXvd8NPWcKsxF0mlJrXvT3auzoCHdQn5_Kh2mA/exec";

// Local storage key for current signed-in users
const STORAGE_KEY = "signedInUsers";

// Cached signed-in users in memory (loaded from localStorage)
let signedInUsers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Helper: Save signedInUsers to localStorage
function saveSignedInUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signedInUsers));
}

// Helper: Send sign-in/out event to Google Sheets backend
function sendToGoogleSheets(name, action) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      action,
      timestamp: new Date().toISOString(),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status !== "success") {
        console.error("Failed to log:", data.message);
      } else {
        console.log(`Logged ${action} for ${name} successfully.`);
      }
    })
    .catch((err) => {
      console.error("Error sending to Google Sheets:", err);
    });
}

// UI elements
const mainDiv = document.getElementById("main");

// Create buttons with animation class
function createButton(text) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = "btn";
  btn.addEventListener("mouseover", () => btn.classList.add("btn-hover"));
  btn.addEventListener("mouseout", () => btn.classList.remove("btn-hover"));
  return btn;
}

// Render main menu: Sign In | Sign Out | View Signed In
function renderMainMenu() {
  mainDiv.innerHTML = "";
  const title = document.createElement("h1");
  title.textContent = "Sign In App";
  mainDiv.appendChild(title);

  const signInBtn = createButton("Sign In");
  signInBtn.onclick = renderSignInForm;
  const signOutBtn = createButton("Sign Out");
  signOutBtn.onclick = renderSignOutList;
  const viewBtn = createButton("View Signed In");
  viewBtn.onclick = renderCurrentlySignedIn;

  mainDiv.appendChild(signInBtn);
  mainDiv.appendChild(signOutBtn);
  mainDiv.appendChild(viewBtn);
}

// Render sign-in form
function renderSignInForm() {
  mainDiv.innerHTML = "";
  const label = document.createElement("label");
  label.textContent = "Enter your name:";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Your name";

  const submitBtn = createButton("Sign In");
  submitBtn.onclick = () => {
    const name = input.value.trim();
    if (!name) {
      alert("Please enter a name.");
      return;
    }
    if (signedInUsers.find((u) => u.name.toLowerCase() === name.toLowerCase())) {
      alert("You are already signed in.");
      return;
    }
    const newUser = { name, signInTime: new Date().toISOString() };
    signedInUsers.push(newUser);
    saveSignedInUsers();
    sendToGoogleSheets(name, "signIn");
    alert(`Welcome, ${name}! You are signed in.`);
    renderMainMenu();
  };

  const backBtn = createButton("Back");
  backBtn.onclick = renderMainMenu;

  mainDiv.appendChild(label);
  mainDiv.appendChild(input);
  mainDiv.appendChild(submitBtn);
  mainDiv.appendChild(backBtn);

  input.focus();
}

// Render list of signed-in users to sign out
function renderSignOutList() {
  mainDiv.innerHTML = "";
  const title = document.createElement("h2");
  title.textContent = "Select a user to sign out:";
  mainDiv.appendChild(title);

  if (signedInUsers.length === 0) {
    const noUsers = document.createElement("p");
    noUsers.textContent = "No users are currently signed in.";
    mainDiv.appendChild(noUsers);
  } else {
    const ul = document.createElement("ul");
    signedInUsers.forEach((user, index) => {
      const li = document.createElement("li");
      li.textContent = `${user.name} (signed in at ${new Date(user.signInTime).toLocaleTimeString()})`;
      li.style.cursor = "pointer";
      li.className = "signout-user";
      li.onclick = () => {
        if (confirm(`Sign out ${user.name}?`)) {
          signedInUsers.splice(index, 1);
          saveSignedInUsers();
          sendToGoogleSheets(user.name, "signOut");
          alert(`${user.name} has been signed out.`);
          renderSignOutList();
        }
      };
      ul.appendChild(li);
    });
    mainDiv.appendChild(ul);
  }

  const backBtn = createButton("Back");
  backBtn.onclick = renderMainMenu;
  mainDiv.appendChild(backBtn);
}

// Render currently signed-in users list
function renderCurrentlySignedIn() {
  mainDiv.innerHTML = "";
  const title = document.createElement("h2");
  title.textContent = "Currently Signed In Users:";
  mainDiv.appendChild(title);

  if (signedInUsers.length === 0) {
    const noUsers = document.createElement("p");
    noUsers.textContent = "No users are currently signed in.";
    mainDiv.appendChild(noUsers);
  } else {
    const ul = document.createElement("ul");
    signedInUsers.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = `${user.name} (signed in at ${new Date(user.signInTime).toLocaleString()})`;
      ul.appendChild(li);
    });
    mainDiv.appendChild(ul);
  }

  const backBtn = createButton("Back");
  backBtn.onclick = renderMainMenu;
  mainDiv.appendChild(backBtn);
}

// Add some basic styles and animations dynamically (optional, can also be in CSS)
const style = document.createElement("style");
style.textContent = `
  body { font-family: Arial, sans-serif; text-ali
