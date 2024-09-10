import { fetchUserStatus, fetchClassrooms, requestComputer, returnComputer, getCarros } from "./repository.js";

let usuario = sessionStorage.getItem("userId");

let libertador = { "0": [], "1": [], "2": [], "3": [] };
let monta = { "1": [], "2": [], "3": [], "4": [], "5": [] };

window.onload = async function () {
    try {
        const response = await fetchUserStatus(usuario);
        if (response.status === 200) {
            return;
        } else if (response.status === 201) {
            const res = JSON.stringify(await response.json());
            console.log(res);
            sessionStorage.setItem("correctKey", res);
            location.href = "../qr.html";
        }
    } catch (error) {
        console.error("Error al cargar el estado del usuario:", error);
    }
};

function showModal() {
    document.getElementById("modal").style.display = "block";
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

document.getElementById("monta").addEventListener("click", showMonta);
document.getElementById("libertador").addEventListener("click", showLibertador);

function showMonta() {
    document.querySelector(".select-libertador").classList.add("disactive");
    document.querySelector(".select-monta").classList.remove("disactive");
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
}

function showLibertador() {
    document.querySelector(".select-monta").classList.add("disactive");
    document.querySelector(".select-libertador").classList.remove("disactive");
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
}

async function updateClassroomsOptions(piso, edificio) {
    let options = [];
    if (edificio === "monta") {
        options = monta[piso] || [];
    } else if (edificio === "libertador") {
        options = libertador[piso] || [];
    }

    classrooms.innerHTML = "";

    let classroomOption = document.createElement("option");
    classroomOption.textContent = "Selecciona un aula";
    classroomOption.disabled = true;
    classroomOption.selected = true;
    classrooms.appendChild(classroomOption);

    options.forEach(room => {
        let opt = document.createElement("option");
        opt.value = room.id;
        opt.textContent = room.roomNumber;
        classrooms.appendChild(opt);
    });

    if (options.length > 0) {
        classrooms.classList.remove("disactive");
        confirmButton.style.display = "block";
        returnButton.style.display = "block";
    } else {
        classrooms.classList.add("disactive");
        confirmButton.style.display = "none";
        returnButton.style.display = "none";
        showModal();
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
    if (selectedClassroom) {
        confirmButton.style.display = "block";
        returnButton.style.display = "block";
    } else {
        confirmButton.style.display = "none";
        returnButton.style.display = "none";
    }
}

confirmButton.addEventListener("click", () => handleRequestComputer());
returnButton.addEventListener("click", () => handleReturnComputer());

async function handleRequestComputer() {
    try {
        const response = await requestComputer(usuario, classrooms.value);
        const res = JSON.stringify(await response.json());
        if (response.status == 200) {
            sessionStorage.setItem("correctKey", res);
            location.href = "../qr.html";
        }
    } catch (error) {
        console.error("Error al solicitar computadora:", error);
    }
}

async function handleReturnComputer() {
    try {
        const response = await returnComputer(usuario, classrooms.value);
        const res = JSON.stringify(await response.json());
        if (response.status == 200) {
            sessionStorage.setItem("correctKey", res);
            location.href = "../qr.html";
        }
    } catch (error) {
        console.error("Error al devolver computadora:", error);
    }
}

async function initializeClassrooms() {
    try {
        // Mostrar la pantalla de carga
        loadingScreen.style.display = "flex";

        const data = await getCarros();
        console.log("Datos recibidos del backend:", data);

        // Limpia las estructuras antes de poblarlas
        for (let key in libertador) libertador[key] = [];
        for (let key in monta) monta[key] = [];

        data.forEach((item) => {
            const roomNumber = item.roomNumber; // Ej: "L001", "M002"
            const building = roomNumber[0]; // "L" o "M"
            
            // Extraemos el número de piso desde el segundo carácter
            const floor = roomNumber[1];

            // Verificamos y asignamos las aulas al edificio y piso correctos
            if (building === "M") {
                if (!monta[floor]) {
                    monta[floor] = []; // Inicializamos el piso si no existe
                }
                monta[floor].push(item); // Asignamos el aula al piso correspondiente
            } else if (building === "L") {
                if (!libertador[floor]) {
                    libertador[floor] = []; // Inicializamos el piso si no existe
                }
                libertador[floor].push(item); // Asignamos el aula al piso correspondiente
            } else {
                console.warn(`Piso no esperado: ${floor} para el edificio ${building}`);
            }
        });

        console.log("Aulas de Montañeses:", monta);
        console.log("Aulas de Libertador:", libertador);

    } catch (error) {
        console.error("Error al inicializar las aulas:", error);
    } finally {
        // Ocultar la pantalla de carga
        loadingScreen.style.display = "none";
    }
}

initializeClassrooms();
