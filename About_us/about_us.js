
    const form = document.getElementById("commentForm");
    const input = document.getElementById("commentInput");
    const list = document.getElementById("commentsList");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        let comment = input.value.trim();
        if (comment === "") return;

        let commentBox = document.createElement("div");
        commentBox.classList.add("comment-box");

        let p = document.createElement("p");
        p.textContent = comment;

        let btn = document.createElement("button");
        btn.textContent = "Delete";

        btn.addEventListener("click", function() {
            commentBox.remove();
        });

        commentBox.appendChild(p);
        commentBox.appendChild(btn);

        list.appendChild(commentBox);

        input.value = "";
    });
