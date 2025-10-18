const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("close");
const modal = document.getElementById("modal");
const addToAccordionBtn = document.getElementById("addToAccordionBtn");
const modalContent = document.querySelector(".modal-content");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const accordion = document.getElementById("accordion");

window.addEventListener("DOMContentLoaded", () => {
    loadingShow();
    fetchData();
});

let posts = [];

function createPost(item) {
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.dataset.id = item.id;

    const title = document.createElement("h2");
    title.textContent = item.question;

    const body = document.createElement("p");
    body.textContent = item.answer;

    const buttonsWrap = document.createElement("div");
    buttonsWrap.className = "buttons";

    const editBtn = document.createElement("button");
    editBtn.className = "edit";
    editBtn.textContent = "Edit";
    editBtn.dataset.action = "edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.action = "delete";

    buttonsWrap.appendChild(editBtn);
    buttonsWrap.appendChild(deleteBtn);

    panel.appendChild(title);
    panel.appendChild(body);
    panel.appendChild(buttonsWrap);

    panel.addEventListener("click", (e) => {
        if (e.target.dataset.action) return;
        document.querySelectorAll(".panel").forEach((p) => {
            if (p !== panel) p.classList.remove("active");
        });
        panel.classList.toggle("active");
    });

    return panel;
}

function renderData() {
    accordion.innerHTML = "";
    posts.forEach((item) => {
        accordion.appendChild(createPost(item));
    });
}

async function fetchData() {
    try {
        const res = await fetch("https://faq-crud.onrender.com/api/faqs");
        const jsonData = await res.json();
        posts = jsonData.data;
        renderData();
        loadingHide();
    } catch (err) {
        alert("Xatolik!");
    }
}

async function addData(question, answer) {
    try {
        const res = await fetch("https://faq-crud.onrender.com/api/faqs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, answer }),
        });
        const jsonData = await res.json();
        const newItem = jsonData.data;
        posts.push(newItem);
        renderData();
        hideModal();
    } catch (err) {
        alert("Xatolik!");
    }
}

async function updateData(id, question, answer) {
    try {
        const res = await fetch(
            `https://faq-crud.onrender.com/api/faqs/${id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, answer }),
            }
        );
        const jsonData = await res.json();
        const updated = jsonData.data;
        posts = posts.map((p) => (p.id === id ? updated : p));
        renderData();
    } catch (err) {
        alert("Xatolik!");
    }
}

async function deleteData(id) {
    try {
        await fetch(`https://faq-crud.onrender.com/api/faqs/${id}`, {
            method: "DELETE",
        });
        posts = posts.filter((p) => p.id !== id);
        renderData();
    } catch (err) {
        alert("Xatolik!");
    }
}

function showModal() {
    modal.style.transform = "translateY(0)";
    modalContent.style.transform = "translateY(0)";
    questionInput.value = "";
    answerInput.value = "";
    questionInput.focus();
}

function hideModal() {
    modal.style.transform = "translateY(-100vh)";
    modalContent.style.transform = "translateY(-100vh)";
}

addBtn.addEventListener("click", showModal);
closeBtn.addEventListener("click", hideModal);

addToAccordionBtn.addEventListener("click", async () => {
    const q = questionInput.value.trim();
    const a = answerInput.value.trim();
    if (!q) return alert("Bosh joy bo'lishi mumkin emas!");
    addToAccordionBtn.style.pointerEvents = "none";
    await addData(q, a);
    addToAccordionBtn.style.pointerEvents = "auto";
});

accordion.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const panel = btn.closest(".panel");
    const id = Number(panel.dataset.id);
    if (btn.dataset.action === "edit") {
        const current = posts.find((p) => p.id === id);
        const newQ = prompt("Edit question:", current.question);
        if (newQ === null) return;
        const newA = prompt("Edit answer:", current.answer);
        if (newA === null) return;
        await updateData(id, newQ.trim(), newA.trim());
    }
    if (btn.dataset.action === "delete") {
        if (!confirm("Rostdan ham o'chirmoqchimisz?")) return;
        await deleteData(id);
    }
});

function loadingShow() {
    document.querySelector(".loading").style.display = "block";
}
function loadingHide() {
    document.querySelector(".loading").style.display = "none";
}
