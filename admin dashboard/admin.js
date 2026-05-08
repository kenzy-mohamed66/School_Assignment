console.log("admin.js is working!");
console.log(document.getElementById("due_date"));

 document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
  
document.querySelectorAll('.middle').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});


document.querySelector(".log").addEventListener("click", function(e) {
  e.preventDefault();
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "../SignUp_Login/Login.html";
  }
});




function clearform() {
  alert("Form cleared 🧹");
}

const nums = document.querySelectorAll(".num");
if (nums.length > 0) {
  nums.forEach(el => {
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      el.textContent = count;
      if (count >= target) clearInterval(interval);
    }, 20);
  });
}


const tableCells = document.querySelectorAll(".the-table td");
if (tableCells.length > 0) {
  tableCells.forEach(td => {
    if (td.textContent.includes("Overdue")) {
   td.parentElement.style.background = "rgba(236, 72, 153, 0.12)";
   td.parentElement.style.borderLeft = "3px solid rgba(236, 72, 153, 0.6)";
    }
  });
}
const dueDateInput = document.getElementById("due_date");
let dateIsValid = false; 

if (dueDateInput) {
  dueDateInput.addEventListener("change", function() {
    const chosen = new Date(this.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chosen < today) {
      alert("⚠️ Warning: The due date you selected is in the past!");
      dueDateInput.value = ""; 
      dateIsValid = false;     
    } else {
      dateIsValid = true;     
    }
  });
}

const formo = document.querySelector("form");
if (formo) {
  formo.addEventListener("submit", function(e) {
    e.preventDefault();

   
    if (dueDateInput) {
      if (dueDateInput.value === "") {
        alert("❌ Please select a due date!");
        dueDateInput.focus();
        return;
      }

      const chosen = new Date(dueDateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (chosen < today) {
        alert("❌ Please select a valid due date!");
        dueDateInput.focus();
        return;
      }
    }

   
    let btn = document.getElementById("submitBtn");
    btn.style.backgroundColor = "orange";
    btn.value = "Saving... ⏳";
    setTimeout(() => { btn.style.backgroundColor = "#22c55e"; btn.value = "Saved ✔️"; }, 1000);
    setTimeout(() => { btn.value = "Submit"; btn.style.backgroundColor = ""; }, 3000);
  });
}

document
.getElementById("taskForm1")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const data = {
        task_id: document.getElementById("task_id").value,
        task_title: document.getElementById("task_title").value,
        teacher_name: document.getElementById("teacher_name").value,
        priority: document.getElementById("priority").value,
        due_date: document.getElementById("due_date").value,
        description: document.getElementById("description").value,
        admin_name: document.getElementById("admin_name").value,
        status: document.getElementById("status").value
    };

    const response = await fetch(
        "http://127.0.0.1:8000/api/tasks/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    const result = await response.json();

    console.log(result);

});