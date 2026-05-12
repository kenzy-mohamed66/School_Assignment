// ============================================
//  CONTACT US PAGE JAVASCRIPT
// ============================================

const API = "http://127.0.0.1:8000/api";

// بياخد الـ username والـ role من الـ localStorage
const username = localStorage.getItem("username");
const role     = localStorage.getItem("role");

document.addEventListener('DOMContentLoaded', function () {

  // لو مفيش يوزر مسجل دخول، رجّعه لصفحة اللوجين
  if (!username) {
    window.location.href = "../SignUp_Login/Login.html";
    return;
  }

  // اضبط الـ navbar حسب الـ role
  setupNavbar();

  // سجّل الـ form submit
  setupContactForm();
});


// ============================================
//  NAVBAR - اضبط اللينكات حسب الـ role
// ============================================

function setupNavbar() {
  // لينك الـ Dashboard بيتغير حسب الدور
  const dashboardLink = document.querySelector('a.middle[href*="dashboard"]');
  if (dashboardLink) {
    if (role === "admin") {
      dashboardLink.href = "../admin dashboard/index.html";
    } else if (role === "teacher") {
      dashboardLink.href = "../kenzy's tasks/teacher_dashboard.html";
    }
  }

  // الروابط دي ظاهرة للأدمن بس
  const adminOnlyLinks = document.querySelectorAll('a.middle[href*="add-task"], a.middle[href*="edit-task"], a.middle[href*="view_created_task"]');
  adminOnlyLinks.forEach(link => {
    if (role !== "admin") {
      link.style.display = "none";
    }
  });

  // Active class على الـ navbar
  document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
}


// ============================================
//  CONTACT FORM - ابعت البيانات للـ API
// ============================================

function setupContactForm() {
  const contactForm = document.querySelector('.contact-form form');

  // إنشاء مربع الرسالة
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

    // تحقق من الحقول
    if (!name || !email || !phone || !message) {
      showMessage(messageBox, 'من فضلك املأ كل الحقول.', false);
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showMessage(messageBox, 'الإيميل غير صحيح.', false);
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      showMessage(messageBox, 'رقم التليفون لازم يكون 11 رقم.', false);
      return;
    }

    // ابعت البيانات للـ API
    try {
      const response = await fetch(`${API}/contact/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, phone, message }),
      });

      const result = await response.json();

      if (response.ok) {
        contactForm.reset();
        showMessage(messageBox, '✓ تم إرسال رسالتك بنجاح!', true);
      } else {
        showMessage(messageBox, '❌ حصل خطأ: ' + JSON.stringify(result), false);
      }

    } catch (error) {
      showMessage(messageBox, '❌ مش قادر يوصل للسيرفر. تأكد إن الباك اند شغال.', false);
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