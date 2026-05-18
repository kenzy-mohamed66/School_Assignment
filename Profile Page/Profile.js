// ============================================
//  PROFILE PAGE JAVASCRIPT
// ============================================

const API = "http://127.0.0.1:8000/api";

// gets the username and role from localStorage saved during login
const username = localStorage.getItem("username");
const role     = localStorage.getItem("role");

document.addEventListener('DOMContentLoaded', function () {

  // if no user is logged in, redirect to the login page
  if (!username) {
    window.location.href = "../SignUp_Login/Login.html";
    return;
  }

  // set up the navbar based on the role
  setupNavbar();

  // load the user profile from the API
  loadProfile();

  // register the event listeners
  initEventListeners();
});


// ============================================
//  NAVBAR - set the links based on role
// ============================================

function setupNavbar() {
  // dashboard link changes based on the role
  const dashboardLink = document.querySelector('a.middle[href*="dashboard"]');
  if (dashboardLink) {
    if (role === "admin") {
      dashboardLink.href = "../admin dashboard/index.html";
    } else if (role === "teacher") {
      dashboardLink.href = "../kenzy's tasks/teacher_dashboard.html";
    }
  }

  // these links are visible to admin only
  const adminOnlyLinks = document.querySelectorAll('a.middle[href*="add-task"], a.middle[href*="edit-task"], a.middle[href*="view_created_task"]');
  adminOnlyLinks.forEach(link => {
    if (role !== "admin") {
      link.style.display = "none";
    }
  });

  // add the username and role to the navbar if there is room
  const userInfo = document.querySelector('.user-info');
  if (userInfo) {
    const nameSpan = document.createElement('span');
    nameSpan.style.marginRight = "10px";
    nameSpan.style.fontSize = "13px";
    nameSpan.style.color = "rgba(255,255,255,0.7)";
    nameSpan.textContent = username + " (" + role + ")";
    userInfo.insertBefore(nameSpan, userInfo.firstChild);
  }
}


// ============================================
//  LOAD PROFILE - get user data from API
// ============================================

async function loadProfile() {
  try {
    const response = await fetch(`${API}/profile/${username}/`);
    const data     = await response.json();

    if (response.ok) {
      document.getElementById('email').value    = data.email      || "";
      document.getElementById('fname').value    = data.first_name || "";  // ✅
      document.getElementById('lname').value    = data.last_name  || "";  // ✅
      document.getElementById('jobtitle').value = data.job_title  || "";  // ✅

      selectRole(data.role || "teacher");
      updateSidebar();
    }
  } catch (error) {
    console.error("Cannot reach server:", error);
  }
}


// ============================================
//  INITIALIZE ALL EVENT LISTENERS
// ============================================

function initEventListeners() {
  // update sidebar when user types
  document.getElementById('fname').addEventListener('input', updateSidebar);
  document.getElementById('lname').addEventListener('input', updateSidebar);
  document.getElementById('jobtitle').addEventListener('input', updateSidebar);

  // role selection
  document.getElementById('card-admin').addEventListener('click', function () {
    selectRole('admin');
  });
  document.getElementById('card-teacher').addEventListener('click', function () {
    selectRole('teacher');
  });

  // save button
  document.querySelector('.save-btn').addEventListener('click', saveProfile);

  // internal nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(el => el.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // active class on the top navbar
  document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
}


// ============================================
//  UPDATE SIDEBAR - when the user types in the form
// ============================================

function updateSidebar() {
  const firstName = document.getElementById('fname').value;
  const lastName  = document.getElementById('lname').value;
  const jobTitle  = document.getElementById('jobtitle').value;

  const fullName = (firstName + ' ' + lastName).trim();
  document.getElementById('sidebar-name').textContent  = fullName  || username;
  document.getElementById('sidebar-title').textContent = jobTitle  || role;

  const firstLetter = firstName.charAt(0).toUpperCase();
  const lastLetter  = lastName.charAt(0).toUpperCase();
  document.getElementById('initials').textContent = (firstLetter + lastLetter) || "?";
}


// ============================================
//  SELECT ROLE CARD
// ============================================

function selectRole(role) {
  document.getElementById('card-admin').classList.remove('selected');
  document.getElementById('card-teacher').classList.remove('selected');
  document.getElementById('card-' + role).classList.add('selected');
}


// ============================================
//  SAVE PROFILE - send changes to the API
// ============================================

async function saveProfile() {
  const newPass     = document.getElementById('new-pass').value.trim();
  const confirmPass = document.getElementById('con-pass').value.trim();
  const curPass     = document.getElementById('cur-pass').value.trim();

  if (newPass || confirmPass) {
    if (newPass.length < 8) {
      showMessage("❌ New password must be at least 8 characters.", false);
      return;
    }
    if (newPass !== confirmPass) {
      showMessage("❌ New password does not match.", false);
      return;
    }
    if (!curPass) {
      showMessage("❌ Please enter your current password first.", false);
      return;
    }
  }

  const selectedRole = document.querySelector('.role-card.selected').id.replace('card-', '');

  // ✅ sending updated fields
  const dataToSend = {
    email:      document.getElementById('email').value.trim(),
    role:       selectedRole,
    first_name: document.getElementById('fname').value.trim(),
    last_name:  document.getElementById('lname').value.trim(),
    job_title:  document.getElementById('jobtitle').value.trim(),
  };

  if (newPass) {
    dataToSend.password = newPass;
  }

  try {
    const response = await fetch(`${API}/profile/${username}/`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("role", selectedRole);
      
      const firstName = document.getElementById('fname').value.trim();
      const lastName  = document.getElementById('lname').value.trim();
      const fullName  = (firstName + ' ' + lastName).trim();
      if (fullName) {
        localStorage.setItem("display_name", fullName);
      }
      
      document.getElementById('cur-pass').value = "";
      document.getElementById('new-pass').value = "";
      document.getElementById('con-pass').value = "";
      showMessage("✓ Changes saved successfully!", true);
    } else {
      showMessage("❌ Error: " + JSON.stringify(result), false);
    }
  } catch (error) {
    showMessage("❌ Cannot reach server.", false);
  }
}


// ============================================
//  SHOW MESSAGE
// ============================================

function showMessage(text, success) {
  const msg = document.getElementById('success-msg');
  msg.textContent = text;
  msg.style.display = 'block';
  msg.style.color   = success ? '#a076f9' : '#ff4d4d';

  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}