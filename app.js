let signedInUsers = JSON.parse(localStorage.getItem('signedInUsers')) || [];

function updateUI() {
  const list = document.getElementById('signedInList');
  list.innerHTML = '';
  signedInUsers.forEach(user => {
    const li = document.createElement('li');
    li.className = "p-3 bg-gray-50 rounded shadow-sm";
    li.textContent = `${user.name} (Signed in at: ${new Date(user.time).toLocaleTimeString()})`;
    list.appendChild(li);
  });
  localStorage.setItem('signedInUsers', JSON.stringify(signedInUsers));
}

function showSignInForm() {
  document.getElementById('formContainer').style.display = 'block';
}

function hideForm() {
  document.getElementById('formContainer').style.display = 'none';
  document.getElementById('nameInput').value = '';
}

function signIn() {
  const name = document.getElementById('nameInput').value.trim();
  if (name) {
    signedInUsers.push({ name: name, time: Date.now() });
    updateUI();
    hideForm();
  }
}

function showSignOutList() {
  const list = document.getElementById('signOutList');
  list.innerHTML = '';
  signedInUsers.forEach((user, index) => {
    const li = document.createElement('li');
    li.className = "flex justify-between items-center bg-gray-50 p-2 rounded shadow-sm";
    li.textContent = user.name;
    const btn = document.createElement('button');
    btn.textContent = 'Sign Out';
    btn.className = "ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700";
    btn.onclick = () => {
      signedInUsers.splice(index, 1);
      updateUI();
      showSignOutList();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
  document.getElementById('signOutContainer').style.display = 'block';
}

function hideSignOut() {
  document.getElementById('signOutContainer').style.display = 'none';
}

updateUI();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker registered.'));
}
