<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sign In PWA</title>

  <!-- Fira Sans Medium -->
  <link
    href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@500&display=swap"
    rel="stylesheet"
  />

  <style>
    :root {
      --text-color: #00b0b9;
      --button-color: #ff585d;

      --bg-light: #fff;
      --bg-dark: #121212;
    }

    body {
      font-family: 'Fira Sans', sans-serif;
      margin: 0;
      background-color: var(--bg-light);
      color: var(--text-color);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    body.dark {
      background-color: var(--bg-dark);
      color: var(--text-color);
    }

    h1, h2 {
      margin: 1rem 0;
    }

    input[type="text"] {
      padding: 0.5rem;
      font-size: 1rem;
      border: 2px solid var(--text-color);
      border-radius: 4px;
      margin-right: 0.5rem;
      color: var(--text-color);
      background: transparent;
      outline: none;
      width: 200px;
      max-width: 90vw;
      box-sizing: border-box;
    }

    input::placeholder {
      color: var(--text-color);
      opacity: 0.7;
    }

    button {
      background-color: var(--button-color);
      border: none;
      color: white;
      padding: 0.6rem 1rem;
      font-weight: 600;
      font-size: 1rem;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    button:hover {
      background-color: #e24a4f;
    }

    button.small {
      padding: 0.3rem 0.6rem;
      font-size: 0.85rem;
      margin-left: 0.5rem;
    }

    ul {
      list-style: none;
      padding-left: 0;
      width: 100%;
      max-width: 400px;
      margin-top: 0.5rem;
    }

    li {
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--text-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      position: fixed;
      width: 80px;
      height: auto;
      user-select: none;
      pointer-events: none;
      opacity: 0.7;
      transition: filter 0.3s ease;
    }

    .top-right {
      top: 1rem;
      right: 1rem;
    }

    .bottom-left {
      bottom: 1rem;
      left: 1rem;
    }

    .mode-toggle {
      margin: 1rem 0;
      user-select: none;
      font-size: 1rem;
    }

    /* Responsive adjustments */
    @media (max-width: 480px) {
      input[type="text"] {
        width: 100%;
        margin-bottom: 0.5rem;
      }
      button {
        width: 100%;
      }
      li {
        flex-direction: column;
        align-items: flex-start;
      }
      button.small {
        margin-left: 0;
        margin-top: 0.3rem;
      }
    }
  </style>
</head>
<body>
  <!-- Logos -->
  <img id="logoTopRight" class="logo top-right" src="logo-light-topright.png" alt="Logo Top Right" />
  <img id="logoBottomLeft" class="logo bottom-left" src="logo-light-bottomleft.png" alt="Logo Bottom Left" />

  <h1>Sign In</h1>

  <div class="mode-toggle">
    <label>
      <input type="checkbox" id="darkModeToggle" /> Dark Mode
    </label>
  </div>

  <div>
    <input
      type="text"
      id="nameInput"
      placeholder="Enter your name"
      autocomplete="off"
    />
    <button id="signInBtn">Sign In</button>
  </div>

  <h2>Currently Signed In</h2>
  <ul id="userList"><li>Loading...</li></ul>

  <!-- Firebase SDK -->
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

  <script>
    // Firebase config - REPLACE with your own config
    const firebaseConfig = {
  apiKey: "AIzaSyBP_07YnGi79bOMY1K6mm3gHVgk2-UUb_o",
  authDomain: "sign-in-backend-bfd1d.firebaseapp.com",
  projectId: "sign-in-backend-bfd1d",
  storageBucket: "sign-in-backend-bfd1d.firebasestorage.app",
  messagingSenderId: "480221653864",
  appId: "1:480221653864:web:02bf18eba295f8f87d04dd",
  measurementId: "G-35MJBXS97H"
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const nameInput = document.getElementById("nameInput");
    const signInBtn = document.getElementById("signInBtn");
    const userList = document.getElementById("userList");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const logoTopRight = document.getElementById("logoTopRight");
    const logoBottomLeft = document.getElementById("logoBottomLeft");

    // Update logos for light/dark mode
    function updateLogos(isDark) {
      logoTopRight.src = isDark
        ? "logo-dark-topright.png"
        : "logo-light-topright.png";
      logoBottomLeft.src = isDark
        ? "logo-dark-bottomleft.png"
        : "logo-light-bottomleft.png";
    }

    // Load initial dark mode state from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    if (savedDarkMode) {
      document.body.classList.add("dark");
      darkModeToggle.checked = true;
      updateLogos(true);
    } else {
      updateLogos(false);
    }

    darkModeToggle.addEventListener("change", () => {
      const isDark = darkModeToggle.checked;
      document.body.classList.toggle("dark", isDark);
      updateLogos(isDark);
      localStorage.setItem("darkMode", isDark);
    });

    // Sign in user
    signInBtn.addEventListener("click", async () => {
      const name = nameInput.value.trim();
      if (!name) {
        alert("Please enter a valid name.");
        return;
      }

      try {
        // Check for duplicates
        const snapshot = await db
          .collection("signedInUsers")
          .where("name_lower", "==", name.toLowerCase())
          .get();

        if (!snapshot.empty) {
          alert("User already signed in.");
          return;
        }

        await db.collection("signedInUsers").add({
          name: name,
          name_lower: name.toLowerCase(),
          signedInAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        nameInput.value = "";
      } catch (error) {
        console.error("Error signing in:", error);
        alert("Error signing in, please try again.");
      }
    });

    // Render users list
    function renderUsers(users) {
      if (users.length === 0) {
        userList.innerHTML = "<li>No users signed in.</li>";
        return;
      }

      userList.innerHTML = "";
      users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = user.name;

        const btn = document.createElement("button");
        btn.textContent = "Sign Out";
        btn.className = "small";
        btn.setAttribute("aria-label", `Sign out ${user.name}`);

        btn.addEventListener("click", async () => {
          try {
            await db.collection("signedInUsers").doc(user.id).delete();
          } catch (error) {
            console.error("Error signing out:", error);
            alert("Error signing out, please try again.");
          }
        });

        li.appendChild(btn);
        userList.appendChild(li);
      });
    }

    // Subscribe to Firestore collection changes
    db.collection("signedInUsers")
      .orderBy("name")
      .onSnapshot(
        (snapshot) => {
          const users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          renderUsers(users);
        },
        (error) => {
          console.error("Error fetching users:", error);
          userList.innerHTML = "<li>Error loading users.</li>";
        }
      );
  </script>
</body>
</html>
