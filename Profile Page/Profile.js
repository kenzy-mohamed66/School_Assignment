// ============================================
//  PROFILE PAGE JAVASCRIPT
// ============================================

const API = "http://127.0.0.1:8000/api";

// بياخد الـ username والـ role من الـ localStorage اللي اتحفظوا وقت الـ Login
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

  // جيب بيانات اليوزر من الـ API
  loadProfile();

  // سجّل الـ event listeners
  initEventListeners();
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

  // ضيف اسم اليوزر ودوره في الـ navbar لو فيه مكان ليه
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
//  LOAD PROFILE - جيب بيانات اليوزر من الـ API
// ============================================

async function loadProfile() {
  try {
    const response = await fetch(`${API}/profile/${username}/`);
    const data     = await response.json();

    if (response.ok) {
      // ملّي الـ fields بالبيانات الجاية من الداتابيز
      document.getElementById('email').value = data.email || "";

      // الاسم: لو فيه مسافة نقسّمه لـ first و last
      const nameParts = (data.username || "").split(" ");
      document.getElementById('fname').value = nameParts[0] || data.username || "";
      document.getElementById('lname').value = nameParts[1] || "";

      // اختار الـ role card الصح
      selectRole(data.role || "teacher");

      // حدّث الـ sidebar
      updateSidebar();

    } else {
      console.error("فشل تحميل البروفايل:", data);
    }

  } catch (error) {
    console.error("مش قادر يوصل للسيرفر:", error);
  }
}


// ============================================
//  INITIALIZE ALL EVENT LISTENERS
// ============================================

function initEventListeners() {
  // حدّث الـ sidebar لما اليوزر يكتب
  document.getElementById('fname').addEventListener('input', updateSidebar);
  document.getElementById('lname').addEventListener('input', updateSidebar);
  document.getElementById('jobtitle').addEventListener('input', updateSidebar);

  // اختيار الـ role
  document.getElementById('card-admin').addEventListener('click', function () {
    selectRole('admin');
  });
  document.getElementById('card-teacher').addEventListener('click', function () {
    selectRole('teacher');
  });

  // زرار الحفظ
  document.querySelector('.save-btn').addEventListener('click', saveProfile);

  // الـ nav links الداخلية
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(el => el.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Active class على الـ navbar العلوي
  document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
}


// ============================================
//  UPDATE SIDEBAR - لما اليوزر يكتب في الفورم
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
//  SAVE PROFILE - ابعت التغييرات للـ API
// ============================================

async function saveProfile() {
  const newPass    = document.getElementById('new-pass').value.trim();
  const confirmPass = document.getElementById('con-pass').value.trim();
  const curPass    = document.getElementById('cur-pass').value.trim();

  // لو كتب باسورد جديد، تحقق منه
  if (newPass || confirmPass) {
    if (newPass.length < 8) {
      showMessage("❌ الباسورد الجديد لازم يكون 8 حروف على الأقل.", false);
      return;
    }
    if (newPass !== confirmPass) {
      showMessage("❌ الباسورد الجديد مش متطابق.", false);
      return;
    }
    if (!curPass) {
      showMessage("❌ اكتب الباسورد الحالي الأول.", false);
      return;
    }
  }

  // الـ role المختار
  const selectedRole = document.querySelector('.role-card.selected').id.replace('card-', '');

  // البيانات اللي هتتبعت
  const dataToSend = {
    email: document.getElementById('email').value.trim(),
    role:  selectedRole,
  };

  // لو في باسورد جديد ضيفه
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
      // لو الـ role اتغير، حدّثه في الـ localStorage
      localStorage.setItem("role", selectedRole);

      // امسح حقول الباسورد
      document.getElementById('cur-pass').value = "";
      document.getElementById('new-pass').value = "";
      document.getElementById('con-pass').value = "";

      showMessage("✓ تم حفظ التغييرات بنجاح!", true);
    } else {
      showMessage("❌ حصل خطأ: " + JSON.stringify(result), false);
    }

  } catch (error) {
    showMessage("❌ مش قادر يوصل للسيرفر.", false);
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