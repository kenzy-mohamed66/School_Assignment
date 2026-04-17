function ValidateSignUp(event) {
    // Get input elements, define email format regex
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm-password");
    const mailFormat = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (passwordInput.value !== confirmInput.value) {
        // Prevent form submission
        event.preventDefault();

        confirmInput.value = "";
        confirmInput.placeholder = "Passwords do not match";
        confirmInput.classList.add("error");

        statusColor(confirmInput, "#ff4d4d");
        return false;
    }

    if (!mailFormat.test(emailInput.value)) {
        event.preventDefault();

        emailInput.value = "";
        emailInput.placeholder = "Invalid email format";
        emailInput.classList.add("error");

        statusColor(emailInput, "#ff4d4d");
        return false;
    }
}

function handleSubmit(event) {
    // Get role from signup/login form
    const roleElement = document.getElementById("signup_role") || document.getElementById("login_role");
    const role = roleElement ? roleElement.value : "";

    if (role === "admin") {
        window.location.href = "../admin dashboard/index.html";
    }
    else if (role === "teacher") {
        window.location.href = "../kenzy's tasks/teacher_dashboard.html";
    }
    else{
        event.preventDefault();
        alert("Please select a valid user role.");
    }
}

function togglePassword(icon) {

    const passwordInput = icon.nextElementSibling;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.replace('fa-eye', 'fa-eye-slash');
        icon.style.color = "#a076f9";
    }
    else {
        passwordInput.type = "password";
        icon.classList.replace('fa-eye-slash', 'fa-eye');
        icon.style.color = "rgb(161, 150, 150)";
    }
}

function statusColor(input, color) {

    input.parentElement.style.borderBottom = `1px solid ${color}`;
}

const form = document.getElementById("signup-form");

if (form) {
    form.onsubmit = function(event) {
        //Checks if required fields is valid
        if (!form.checkValidity()) {
            return; 
        }
        //Checks if Confirm Password exists
        if(document.getElementById('confirm-password')){
            ValidateSignUp(event);
        }
        //If validation passed, redirection run
        if (!event.defaultPrevented) {
            handleSubmit(event);
        }
    }
}

const loginForm = document.getElementById("login-form");

if (loginForm) {
    //Check if required fields is valid
    loginForm.onsubmit = function(event) {
        event.preventDefault();
        handleSubmit(event);
    }
}

document.querySelectorAll(".fa-eye").forEach(icon => {
    icon.onclick = () => { togglePassword(icon); };
});

document.querySelectorAll('input:not([type="submit"])').forEach(input => {

    // Lama el user yedos gwa el input, Purple border
    input.onfocus = () => { 
        statusColor(input, "#a076f9"); 

        input.classList.remove("error"); // Remove error when user focuses on input

        if(input.id === "confirm-password") { input.placeholder = "Confirm Password"; }
        if(input.id === "email") { input.placeholder = "Email";}
    }; 

    input.classList.remove("error"); // Remove error when user focuses on input

    if(input.id === "confirm-password"){ 
        input.placeholder = "Confirm Password"; 
    }
    if(input.id === "email"){ 
        input.placeholder = "Email"; 
    }

    // Lama el user yokhrog bara el input, Check logic
    input.onblur = () => {
        if (input.hasAttribute("required") && input.value.trim() === "") {
            statusColor(input, "#ff4d4d"); // Red if empty
        }
        else {
            statusColor(input, "rgb(112, 102, 102)"); // Gray if valid
        }
    };
});