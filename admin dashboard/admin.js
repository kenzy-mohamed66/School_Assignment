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

//for user greeting (A small Update done by Hazem)
const username    = localStorage.getItem("username");
const displayName = localStorage.getItem("display_name") || username; 
const greet = document.querySelector(".greet");

if (greet) {
  greet.innerHTML = `Welcome Back,<br>${displayName}`;
}

function clearform() {
  alert("Form cleared");
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
      alert("Warning: The due date you selected is in the past!");
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
        alert("Please select a due date!");
        dueDateInput.focus();
        return;
      }

      const chosen = new Date(dueDateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (chosen < today) {
        alert("Please select a valid due date!");
        dueDateInput.focus();
        return;
      }
    }

   
    let btn = document.getElementById("submitBtn");
    btn.style.backgroundColor = "orange";
    btn.value = "Saving...";
    setTimeout(() => { btn.style.backgroundColor = "#22c55e"; btn.value = "Saved"; }, 1000);
    setTimeout(() => { btn.value = "Submit"; btn.style.backgroundColor = ""; }, 3000);
  });
}

const taskForm = document.getElementById("taskform1");

if (taskForm) {

    taskForm.addEventListener("submit", async function(e) {

        e.preventDefault();

        const data = {
            task_id: document.getElementById("task_id").value,
            task_title: document.getElementById("task_title").value,
            teacher_name: document.getElementById("teacher_name").value,
            priority: document.getElementById("priority").value,
            due_date: document.getElementById("due_date").value,
            description: document.getElementById("description").value,
            admin_name: document.getElementById("admin_name").value,
            status: document.getElementById("status").value,
            course: document.getElementById("Course").value,
        };

        try {

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

            if (response.ok) {
                const result = await response.json();
                console.log("Task added:", result);
                alert("Task added successfully!");
                
                
                window.location.href = "view_created_task.html";
            } else {
                const error = await response.json();
                console.error("Error:", error);
                alert("❌ Failed to add task. Please check the form fields.");
            }

            // const result = await response.json();

            // console.log("Task added:", result);

        } catch (error) {

            console.error("Error adding task:", error);

        }

    });

}


async function loadDashboard() {
    console.log("FETCHING DASHBOARD...");

    try {
        const response = await fetch("http://127.0.0.1:8000/api/dashboard-stats/");
        const data = await response.json();

        console.log("Dashboard data:", data);

        const teachers = document.getElementById("teachers-count");
        const courses = document.getElementById("courses-count");
        const assignments = document.getElementById("assignments-count");
        const completed = document.getElementById("completed-count");
        const pending = document.getElementById("pending-count");
        const overdue = document.getElementById("overdue-count");
        const completionRate = document.getElementById("completion-rate");

        if (teachers) teachers.innerText = data.teachers;
        if (courses) courses.innerText = data.courses;
        if (assignments) assignments.innerText = data.assignments;
        if (completed) completed.innerText = data.completed;
        if (pending) pending.innerText = data.in_progress;        if (overdue) overdue.innerText = data.overdue;

        if (completionRate) {
            completionRate.innerText = data.completion_rate + "%";
        }

    } catch (error) {
        console.error("Dashboard load failed:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("teachers-count")) {
        loadDashboard();
    }
});

async function loadTasksTable() {

    try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/");
        const data = await response.json();

        const tableBody = document.getElementById("task-table-body");

        if (!tableBody) return;

        tableBody.innerHTML = "";

        data.forEach(task => {

            const row = document.createElement("tr");

            let statusDisplay = task.status;

            if (task.status === "completed") {
                statusDisplay = "Completed";
            } 
            else if (task.status === "In Progress" || task.status === "in_progress") {
                statusDisplay = "In Progress";
            } 
            else {
                statusDisplay = task.status;
            }

            row.innerHTML = `
                <td>${task.course || "No Course"}</td>
                <td>${statusDisplay}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading tasks table:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("teachers-count")) {
        loadDashboard();
    }

    loadTasksTable(); 
});