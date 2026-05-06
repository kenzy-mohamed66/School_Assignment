let titles = [
    "Step Into Learning",
    "Learn While Having Fun",
    "Complete Tasks & Earn Stars",
    "Be Smart. Be Fast."
];

let i = 0;

setInterval(() => {
    document.getElementById("title").textContent = titles[i];
    i = (i + 1) % titles.length;
}, 3000);


function startNow() {
    window.scrollTo({
        top: 600,
        behavior: "smooth"
    });
}


window.addEventListener("scroll", function () {
    let nav = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        nav.style.background = "rgba(0,0,0,0.4)";
    } else {
        nav.style.background = "rgba(255,255,255,0.1)";
    }
});
