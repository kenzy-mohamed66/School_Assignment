    // const form = document.getElementById("commentForm");
    // const input = document.getElementById("commentInput");
    // const list = document.getElementById("commentsList");

    // form.addEventListener("submit", function(e) {
    //     e.preventDefault(); // prevent Reload

    //     let comment = input.value.trim();

    //     if (comment === "") return;

    //     let p = document.createElement("p");
    //     p.innerHTML = comment;

    //     list.appendChild(p);

    //     input.value = "";
    // });

    const form = document.getElementById("commentForm");
    const input = document.getElementById("commentInput");
    const list = document.getElementById("commentsList");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        let comment = input.value.trim();
        if (comment === "") return;

        // container للكومنت
        let commentBox = document.createElement("div");
        commentBox.classList.add("comment-box");

        // النص
        let p = document.createElement("p");
        p.textContent = comment;

        // زرار delete
        let btn = document.createElement("button");
        btn.textContent = "Delete";

        btn.addEventListener("click", function() {
            commentBox.remove();
        });

        // تجميع العناصر
        commentBox.appendChild(p);
        commentBox.appendChild(btn);

        list.appendChild(commentBox);

        input.value = "";
    });
