import { fetchUserStatus, fetchClassrooms, requestComputer, returnComputer, getCarros } from "./repository.js";

let usuario = localStorage.getItem("userId");
let libertador = { "0": [], "1": [], "2": [], "3": [] };
let monta = { "1": [], "2": [], "3": [], "4": [], "5": [] };

window.onload = async function () {
    try {
        if (!usuario) {
            console.error("No hay usuario en localStorage");
            return;
        }

        const response = await fetchUserStatus(usuario);
        if (response.status === 200) {
            return;
        } else if (response.status === 201) {
            const res = await response.json();
            localStorage.setItem("correctKey", JSON.stringify(res));
            location.href = "../qr.html";
        }
    } catch (error) {
        console.error("Error al cargar el estado del usuario:", error);
    }
};

function showModal(message) {
    const modal = document.getElementById("modal");
    document.getElementById("modal-message").textContent = message;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

document.getElementById("closeModal").addEventListener("click", closeModal);

const selectMonta = document.getElementById("select-monta");
const selectLib = document.getElementById("select-libertador");
const classrooms = document.getElementById("classrooms");
const confirmButton = document.getElementById("confirmButton");
const returnButton = document.getElementById("returnButton");
const loadingScreen = document.getElementById("loadingScreen");

document.getElementById("monta").addEventListener("click", () => toggleBuilding("monta"));
document.getElementById("libertador").addEventListener("click", () => toggleBuilding("libertador"));

function toggleBuilding(building) {
    document.querySelector(".select-monta").classList.toggle("disactive", building !== "monta");
    document.querySelector(".select-libertador").classList.toggle("disactive", building !== "libertador");
    classrooms.classList.add("disactive");
    confirmButton.classList.add("disactive");
    returnButton.classList.add("disactive");
    classrooms.innerHTML = "";
}

async function updateClassroomsOptions(piso, edificio) {
    const options = edificio === "monta" ? monta[piso] : libertador[piso];

    classrooms.innerHTML = "";

    const classroomOption = document.createElement("option");
    classroomOption.textContent = "Selecciona un aula";
    classroomOption.disabled = true;
    classroomOption.selected = true;
    classrooms.appendChild(classroomOption);

    options.forEach(room => {
        const opt = document.createElement("option");
        opt.value = room.id;
        opt.textContent = room.roomNumber;
        classrooms.appendChild(opt);
    });

    const isActive = options.length > 0;
    classrooms.classList.toggle("disactive", !isActive);
    confirmButton.classList.toggle("disactive", !isActive);
    returnButton.classList.toggle("disactive", !isActive);

    if (!isActive) {
        showModal("No hay aulas disponibles en este piso, por favor seleccione otra.");
    }
}

selectMonta.addEventListener("change", async () => {
    const selectedFloor = selectMonta.value.slice(1);
    monta[selectedFloor] = await fetchClassrooms("monta");
    updateClassroomsOptions(selectedFloor, "monta");
});

selectLib.addEventListener("change", async () => {
    const selectedFloor = selectLib.value.slice(1);
    libertador[selectedFloor] = await fetchClassrooms("libertador");
    updateClassroomsOptions(selectedFloor, "libertador");
});

classrooms.addEventListener("change", checkAllSelected);

function checkAllSelected() {
    const selectedClassroom = classrooms.value;
    confirmButton.disabled = !selectedClassroom;
    returnButton.disabled = !selectedClassroom;
}

confirmButton.addEventListener("click", async () => {
    try {
        loadingScreen.style.display = "block";
        await requestComputer(usuario, classrooms.value);
        alert("Retiro de computadora registrado con éxito");
    } catch (error) {
        console.error("Error en el retiro de computadora:", error);
    } finally {
        loadingScreen.style.display = "none";
    }
});

returnButton.addEventListener("click", async () => {
    try {
        loadingScreen.style.display = "block";
        await returnComputer(usuario, classrooms.value);
        alert("Devolución de computadora registrada con éxito");
    } catch (error) {
        console.error("Error en la devolución de computadora:", error);
    } finally {
        loadingScreen.style.display = "none";
    }
});

getCarros();
