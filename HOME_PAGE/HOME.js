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



// animated counter
const counters = document.querySelectorAll('.count');

const startCounting = (entry) => {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const current = parseFloat(counter.innerText);
      const increment = target / 50; // speed

      if (current < target) {
        let newValue = current + increment;
        if (newValue >= target) {
          counter.innerText = target;
        } else {
          counter.innerText = newValue.toFixed(1);
        }
        setTimeout(updateCount, 50);
      }
    };
    updateCount();
  });
};



// Intersection Observer 
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounting();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector('.stats'));