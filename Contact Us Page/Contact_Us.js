document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.querySelector('.contact-form form');
  const messageBox = document.createElement('div');

  messageBox.className = 'form-message';
  messageBox.style.marginTop = '1rem';
  messageBox.style.padding = '12px 16px';
  messageBox.style.borderRadius = '14px';
  messageBox.style.display = 'none';
  messageBox.style.fontSize = '0.95rem';
  contactForm.appendChild(messageBox);

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !message) {
      showMessage('Please complete all fields before submitting.', false);
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showMessage('Please enter a valid email address.', false);
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      showMessage('Phone number must be exactly 11 digits.', false);
      return;
    }

    contactForm.reset();
    showMessage('Thank you! Your message has been submitted.', true);
  });

  function showMessage(text, success) {
    messageBox.textContent = text;
    messageBox.style.display = 'block';
    messageBox.style.backgroundColor = success ? '#e9f7ef' : '#fdecea';
    messageBox.style.color = success ? '#1f7a4f' : '#9d1d21';
  }
});



  document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });

