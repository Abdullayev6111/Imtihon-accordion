const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("close");
const accordion = document.getElementById("accordion");
const addToAccordionBtn = document.getElementById("addToAccordionBtn");
const modal = document.getElementById("modal");
const modalContent = document.querySelector(".modal-content");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");

window.addEventListener("DOMContentLoaded", () => {
    fetchData();
    getPost();
    deletePost();
});

async function fetchData() {
    try {
        const res = await fetch("https://faq-crud.onrender.com/api/faqs");
        if (!res.ok) throw new Error("Ma'lumot topilmadi");
        posts = await res.json();
    } catch (error) {
        console.log(error.message);
    }
    renderData();
}

async function createPost() {
    const newPost = {
        question: questionInput.value.trim(),
        answer: answerInput.value.trim(),
    };

    if (!newPost.question || !newPost.answer) {
        alert("Iltimos, savol va javobni to'ldiring");
        return;
    }

    try {
        const res = await fetch("https://faq-crud.onrender.com/api/faqs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Server bilan hatolik bor`);
        }

        const created = await res.json();
        if (created && created.id) posts.push(created);
        else await fetchData();

        renderData();
        questionInput.value = "";
        answerInput.value = "";
    } catch (error) {
        console.log("Xatolik: " + error.message);
    }
    closeModal();
}

let posts = [];

function renderData() {
    accordion.innerHTML = "";
    posts.map((item) => {
        const panel = document.createElement("div");
        panel.classList.add("panel");
        panel.setAttribute("data-id", item.id);

        panel.innerHTML = `
    <h2>${item.question}</h2>
    <p>${item.answer}</p>
    <div class = "buttons">
        <button class="edit" data-id="${item.id}">Edit</button>
        <button class="delete" onclick="deletePost(${item.id})">Delete</button>
    </div>
    `;
        accordion.appendChild(panel);
    });

    accordion.addEventListener("click", (e) => {
        const target = e.target;
        const panel = target.closest(".panel");
        if (!panel) return;

        const id = panel.getAttribute("data-id");

        if (target.tagName === "H2") {
            document
                .querySelectorAll(".panel")
                .forEach((p) => p.classList.remove("active"));
            panel.classList.add("active");
        }

        if (target.classList.contains("edit")) {
            e.stopPropagation();
            const answer = panel.querySelector("p");
            const newText = prompt(
                "Yangi javobni kiriting:",
                answer.textContent
            );
            if (newText !== null && newText.trim() !== "") {
                answer.textContent = newText;
            }
        }

        if (target.classList.contains("delete")) {
            e.stopPropagation();
            const confirmDelete = confirm("Rostdan ham o'chirmoqchimisz ?");
            if (confirmDelete) {
                panel.remove();
            }
        }
    });
}

addBtn.addEventListener("click", () => {
    modal.style.transform = "translateY(0vh)";
    modalContent.style.transform = "translateY(0vh)";
});

closeBtn.addEventListener("click", () => {
    closeModal();
    questionInput.value = "";
    answerInput.value = "";
});

if (addToAccordionBtn) {
    addToAccordionBtn.addEventListener("click", createPost);
}

function closeModal() {
    modal.style.transform = "translateY(-100vh)";
    modalContent.style.transform = "translateY(-100vh)";
}

async function getPost() {
    let res = await fetch("https://faq-crud.onrender.com/api/faqs");
    let { data } = await res.json();
    posts = data;
    renderData();
}

async function deletePost(id) {
    let res = await fetch(`https://faq-crud.onrender.com/api/faqs/${id}`, {
        method: "DELETE",
    });
    let { data } = await res.json();
    posts = data;
    renderData();
}
