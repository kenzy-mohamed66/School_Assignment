document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });

  //--------------------------------------------------------

// DELETE
function deleteTask(btn) {
    // event.preventDefault();

    let confirmDelete = confirm("Are you sure you want to delete this task?");
    
    if (confirmDelete) {
        let row = btn.closest("tr");
        row.remove();
    }
}

// EDIT
// function editTask(btn) {
//     // event.preventDefault();

//     let row = btn.closest("tr");

//     let title = row.children[1];
//     let teacher = row.children[2];
//     let course = row.children[3];
//     let priority = row.children[4];
//     let description = row.children[5];
//     let status = row.children[6];

//     let newTitle = prompt("Edit Title:", title.innerText);
//     let newTeacher = prompt("Edit Teacher:", teacher.innerText);
//     let newCourse = prompt("Edit Course:", course.innerText);
//     let newPriority = prompt("Edit Priority:", priority.innerText);
//     let newDescription = prompt("Edit Description:", description.innerText);
//     let newStatus = prompt("Edit Status:", status.innerText);

//     if (newTitle) title.innerText = newTitle;
//     if (newTeacher) teacher.innerText = newTeacher;
//     if (newCourse) course.innerText = newCourse;
//     if (newPriority) priority.innerText = newPriority;
//     if (newDescription) description.innerText = newDescription;
//     if (newStatus) status.innerText = newStatus;
// }

//backend sondos editTask


//edits 
// 1. Get the task ID from the URL (e.g. edit-task.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const taskId = urlParams.get('id');

window.onload = function () {
    if (!taskId) {
        alert("No task ID provided in the URL!");
        return;
    }

    // 2. Fetch the specific task details from the Django backend
    fetch(`http://127.0.0.1:8000/tasks/${taskId}/`)
        .then(res => {
            if (!res.ok) throw new Error("Task not found");
            return res.json();
        })
        .then(data => {
            // 3. Fill the HTML form inputs with the existing data
            document.getElementById("title").value = data.title;
            document.getElementById("description").value = data.description;
            
            // Map the backend 'student' to your 'due_date' input
            document.getElementById("due_date").value = data.student || ""; 
            // Map the backend 'completed' boolean to your 'status' dropdown
            document.getElementById("status").value = data.completed ? "Done" : "Pending";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Could not load task details.");
        });
};

function updateTask(event) {
    event.preventDefault(); // Stop the form from reloading the page

    if (!taskId) return;

    // 4. Gather the updated data from the form
    const updatedData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        // Map the form fields back to your Django model's expected fields
        student: document.getElementById("due_date").value,
        completed: document.getElementById("status").value === "Done"
    };

    // 5. Send a PUT request to update the task in the database
    fetch(`http://127.0.0.1:8000/tasks/${taskId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    })
    .then(res => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
    })
    .then(data => {
        alert("Task updated successfully ✅");
        // Optional: Uncomment the line below to automatically redirect to the tasks page after saving
        // window.location.href = "view_created_tasks.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to update task.");
    });
}

//Adham



document.addEventListener("DOMContentLoaded", () => {
    loadTasksTable();
});

//Add

async function loadTasksTable() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/");
        const data = await response.json();

        const tableBody = document.querySelector("table tbody");
        
        if (!tableBody) {
            
            const table = document.querySelector("table");
            if (table) {
                const tbody = document.createElement("tbody");
                table.appendChild(tbody);
                populateTable(tbody, data);
            }
        } else {
            populateTable(tableBody, data);
        }

    } catch (error) {
        console.error("Error loading tasks table:", error);
    }
}

function populateTable(tbody, tasks) {
    tbody.innerHTML = "";

    if (tasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center;">No tasks found. Create a new task!</td>
            </tr>
        `;
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.task_id}</td>
            <td>${task.task_title}</td>
            <td>${task.teacher_name}</td>
            <td>${task.course || "No Course"}</td>
            <td>${task.priority}</td>
            <td>${task.description}</td>
            <td>${getStatusBadge(task.status)}</td>
            <td>${task.admin_name}</td>
            <td>
                <a href="#" onclick="editTask(${task.id})" class="edit-btn">Edit ✏️</a>
                <a href="#" onclick="deleteTaskFromAPI(${task.id})" class="delete-btn">Delete 🗑️</a>
            </td>
        `;

        
        if (task.status.toLowerCase() === 'overdue') {
            row.style.background = "rgba(236, 72, 153, 0.12)";
            row.style.borderLeft = "3px solid rgba(236, 72, 153, 0.6)";
        }

        tbody.appendChild(row);
    });
}

function getStatusBadge(status) {
    const statusLower = status.toLowerCase();
    switch(statusLower) {
        case 'completed':
            return 'Completed ✅';
        case 'pending':
            return 'Pending ⏳';
        case 'in_progress':
            return 'In Progress 🔄';
        case 'overdue':
            return 'Overdue ⚠️';
        default:
            return status;
    }
}

// Delete 
async function deleteTaskFromAPI(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("✅ Task deleted successfully!");
                loadTasksTable(); // إعادة تحميل الجدول
            } else {
                alert("❌ Failed to delete task.");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("❌ Network error. Please try again.");
        }
    }
}

function editTask(taskId) {
    window.location.href = `edit-task.html?id=${taskId}`;
}


