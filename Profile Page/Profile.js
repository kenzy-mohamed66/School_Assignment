// ============================================
//  PROFILE PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize event listeners when the page loads
  initEventListeners();
});

// ============================================
//  INITIALIZE ALL EVENT LISTENERS
// ============================================

function initEventListeners() {
  // Update sidebar when user types in name or job title fields
  document.getElementById('fname').addEventListener('input', updateSidebar);
  document.getElementById('lname').addEventListener('input', updateSidebar);
  document.getElementById('jobtitle').addEventListener('input', updateSidebar);

  // Role card selection
  document.getElementById('card-admin').addEventListener('click', function() {
    selectRole('admin');
  });
  document.getElementById('card-teacher').addEventListener('click', function() {
    selectRole('teacher');
  });

  // Save button
  document.querySelector('.save-btn').addEventListener('click', saveProfile);

  // Navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      // Remove active class from all links
      navLinks.forEach(function(el) {
        el.classList.remove('active');
      });
      // Add active class to clicked link
      link.classList.add('active');
    });
  });
}

// ============================================
//  UPDATE SIDEBAR (runs when user types)
// ============================================

function updateSidebar() {
  // Get values from input fields
  const firstName = document.getElementById('fname').value;
  const lastName = document.getElementById('lname').value;
  const jobTitle = document.getElementById('jobtitle').value;

  // Update full name in sidebar
  const fullName = firstName + ' ' + lastName;
  document.getElementById('sidebar-name').textContent = fullName;

  // Update job title in sidebar
  document.getElementById('sidebar-title').textContent = jobTitle;

  // Update initials
  const firstLetter = firstName.charAt(0).toUpperCase();
  const lastLetter = lastName.charAt(0).toUpperCase();
  document.getElementById('initials').textContent = firstLetter + lastLetter;
}

// ============================================
//  SELECT A ROLE CARD (Admin or Teacher)
// ============================================

function selectRole(role) {
  // Remove selected class from both cards
  document.getElementById('card-admin').classList.remove('selected');
  document.getElementById('card-teacher').classList.remove('selected');

  // Add selected class to the chosen card
  document.getElementById('card-' + role).classList.add('selected');
}

// ============================================
//  SAVE PROFILE
// ============================================

function saveProfile() {
  // Show success message
  const msg = document.getElementById('success-msg');
  msg.style.display = 'block';

  // Hide after 3 seconds
  setTimeout(function() {
    msg.style.display = 'none';
  }, 3000);
}

  
  document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
