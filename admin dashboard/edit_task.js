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
function editTask(btn) {
    // event.preventDefault();

    let row = btn.closest("tr");

    let title = row.children[1];
    let teacher = row.children[2];
    let course = row.children[3];
    let priority = row.children[4];
    let description = row.children[5];
    let status = row.children[6];

    let newTitle = prompt("Edit Title:", title.innerText);
    let newTeacher = prompt("Edit Teacher:", teacher.innerText);
    let newCourse = prompt("Edit Course:", course.innerText);
    let newPriority = prompt("Edit Priority:", priority.innerText);
    let newDescription = prompt("Edit Description:", description.innerText);
    let newStatus = prompt("Edit Status:", status.innerText);

    if (newTitle) title.innerText = newTitle;
    if (newTeacher) teacher.innerText = newTeacher;
    if (newCourse) course.innerText = newCourse;
    if (newPriority) priority.innerText = newPriority;
    if (newDescription) description.innerText = newDescription;
    if (newStatus) status.innerText = newStatus;
}