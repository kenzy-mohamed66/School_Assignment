document.querySelectorAll('.middle').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });

  //--------------------------------------------------------

// DELETE
function deleteTask(btn) {
    let confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        let row = btn.closest("tr");
        row.remove();
    }
}

// EDIT
// sondos part: Navigate directly to the edit-task.html page with the selected task's ID
function editTask(btn) {
    let row = btn.closest("tr");
    let taskId = row.children[0].innerText.trim();
    window.location.href = `edit-task.html?id=${taskId}`;
}


//edits 
let currentTaskId = null;

window.onload = function () {
    const titleSelect = document.getElementById("title");
    if (!titleSelect) return; // Exit if not on the edit page

    // Fetch all tasks from the database to populate the dropdown
    fetch(`http://127.0.0.1:8000/api/tasks/`)
        .then(res => res.json())
        .then(tasks => {
            tasks.forEach(task => {
                const option = document.createElement("option");
                option.value = task.id; // Backend ID
                option.textContent = task.task_title;
                option.setAttribute("data-title", task.task_title);
                titleSelect.appendChild(option);
            });

            // If there's an ID in the URL (from clicking Edit on dashboard), select it automatically
            const urlParams = new URLSearchParams(window.location.search);
            const urlTaskId = urlParams.get('id');
            if (urlTaskId) {
                titleSelect.value = urlTaskId;
                loadTaskDetails(urlTaskId);
            }
        })
        .catch(err => console.error("Error loading tasks:", err));

    // When the user selects a task from the dropdown, fetch its details
    titleSelect.addEventListener("change", function() {
        const selectedId = this.value;
        if (selectedId) {
            loadTaskDetails(selectedId);
        } else {
            // Clear the form if "-- Select a Task --" is chosen
            document.getElementById("description").value = "";
            document.getElementById("due_date").value = "";
            if (document.getElementById("status")) {
                document.getElementById("status").value = "Pending";
            }
            currentTaskId = null;
        }
    });
};

function loadTaskDetails(taskId) {
    currentTaskId = taskId;
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`)
        .then(res => {
            if (!res.ok) throw new Error("Task not found");
            return res.json();
        })
        .then(data => {
            document.getElementById("description").value = data.description || "";
            document.getElementById("due_date").value = data.due_date || ""; 
            if (document.getElementById("status")) {
                document.getElementById("status").value = data.status || "";
            }
            // Ensure the select dropdown matches this task
            document.getElementById("title").value = taskId;
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Could not load task details. It may not exist in the database yet.");
        });
}


function updateTask(event) {
    event.preventDefault(); // Stop the form from reloading the page

    if (!currentTaskId) {
        alert("Please select a task from the dropdown to edit!");
        return;
    }

    const titleSelect = document.getElementById("title");
    const selectedOption = titleSelect.options[titleSelect.selectedIndex];
    const taskTitle = selectedOption.getAttribute("data-title");

    // Gather the updated data from the form
    const updatedData = {
        task_title: taskTitle, // keep original title
        description: document.getElementById("description").value,
        due_date: document.getElementById("due_date").value,
        status: document.getElementById("status") ? document.getElementById("status").value : ""
    };

    // Send a PUT request to update the task in the database
    fetch(`http://127.0.0.1:8000/api/tasks/${currentTaskId}/`, {
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
        // Automatically redirect to the tasks page after saving
        window.location.href = "view_created_task.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to update task.");
    });
}
