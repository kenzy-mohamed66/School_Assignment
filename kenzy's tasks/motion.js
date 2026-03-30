const subjectSelect = document.getElementById("Subjects");

subjectSelect.addEventListener("change", function() {
    let selectedValue = this.value.toLowerCase();
    
    let rows = document.querySelectorAll("table tr");

    rows.forEach((row, index) => {
        if (index === 0) return;

        let rowText = row.cells[0].innerText.toLowerCase();

        if (selectedValue === "all" || rowText.includes(selectedValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none"; 
        }
    }); 
});