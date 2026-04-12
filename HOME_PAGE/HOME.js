// simple hover animation enhancement
const buttons = document.querySelectorAll("button");

buttons.forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    btn.style.transform += " scale(1.05)";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = btn.style.transform.replace(" scale(1.05)", "");
  });
});
