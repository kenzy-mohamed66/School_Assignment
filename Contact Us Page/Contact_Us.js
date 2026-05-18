// ============================================
//  CONTACT US PAGE JAVASCRIPT
// ============================================

const API = "http://127.0.0.1:8000/api";

// gets the username and role from localStorage
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

  // register the form submit
  setupContactForm();
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

  // Active class on the navbar
  document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
}


// ============================================
//  CONTACT FORM - send data to the API
// ============================================

function setupContactForm() {
  const contactForm = document.querySelector('.contact-form form');

  // create the message box
  const messageBox = document.createElement('div');
  messageBox.className = 'form-message';
  messageBox.style.cssText = "margin-top:1rem; padding:12px 16px; border-radius:14px; display:none; font-size:0.95rem;";
  contactForm.appendChild(messageBox);

  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // validate the fields
    if (!name || !email || !phone || !message) {
      showMessage(messageBox, 'Please fill in all fields.', false);
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showMessage(messageBox, 'Invalid email.', false);
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      showMessage(messageBox, 'Phone number must be 11 digits.', false);
      return;
    }

    // send data to the API
    try {
      const response = await fetch(`${API}/contact/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, phone, message }),
      });

      const result = await response.json();

      if (response.ok) {
        contactForm.reset();
        showMessage(messageBox, '✓ Your message has been sent successfully!', true);
      } else {
        showMessage(messageBox, '❌ Error: ' + JSON.stringify(result), false);
      }

    } catch (error) {
      showMessage(messageBox, '❌ Cannot reach server. Make sure the backend is running.', false);
    }
  });
}


// ============================================
//  SHOW MESSAGE
// ============================================

function showMessage(box, text, success) {
  box.textContent          = text;
  box.style.display        = 'block';
  box.style.backgroundColor = success ? 'rgba(31,122,79,0.15)' : 'rgba(157,29,33,0.15)';
  box.style.color           = success ? '#1f7a4f' : '#ff4d4d';
}