document.addEventListener("DOMContentLoaded", function() {
    function showTab(tabId) {
        document.querySelectorAll(".content").forEach(tab => {
            tab.classList.remove("active");
        });
        document.getElementById(tabId).classList.add("active");

        document.querySelectorAll(".decision-button").forEach(button => {
            button.classList.remove("active");
        });
        document.getElementById("button-" + tabId).classList.add("active");
    }

    document.querySelectorAll(".decision-button").forEach(button => {
        button.addEventListener("click", function() {
            let tabId = this.id.replace("button-", "");
            showTab(tabId);
        });
    });

    let hash = window.location.hash.substring(1);
    showTab(hash || "login");

    document.getElementById("login-form").addEventListener("submit", function(event) {
        event.preventDefault();
        logueo_user({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        });
    });

    document.getElementById("register-form").addEventListener("submit", function(event) {
        event.preventDefault();
        register_user({
            username: document.getElementById("dni").value,
            password: document.getElementById("register-password").value,
        });
    });
});

async function register_user(user) {
    try {
        let response = await fetch(`https://secure-track-db.vercel.app/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        let data = await response.json()
        console.log(data);
        if (response.status === 200) {
            localStorage.setItem("userId", data.id)
            location.href = "../selectorItems.html"
        }
    } catch (error) {
        console.log(error);
    }
}

async function logueo_user(user) {
    try {
        let response = await fetch(`https://secure-track-db.vercel.app/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        let data = await response.json();
        console.log(data);
        if (data.occupation === "Estudiante") {
              localStorage.setItem("userId", data.id)
            location.href = "../selectorItems.html"

        } else if (data.occupation === "Asistente") {
              localStorage.setItem("userId", data.id)
            location.href = "../asistente.html"
        } else if(data.occupation === "Profesor") {
              localStorage.setItem("userId", data.id)
            location.href = "../profesor.html"
        }
    } catch (error) {
        console.log(error);
    }
}
