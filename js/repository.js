// repository.js

export async function fetchUserStatus(userId) {
    try {
        const response = await fetch("https://secure-track-db.vercel.app/users/status", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: parseInt(userId),
            }),
        });
        return response;
    } catch (error) {
        console.error("Error al obtener el estado del usuario:", error);
        throw error;
    }
}

export async function fetchClassrooms() {
    try {
        const response = await fetch("https://secure-track-db.vercel.app/rooms");
        if (!response.ok) {
            throw new Error("Error al obtener aulas");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al realizar el fetch de aulas:", error);
        throw error;
    }
}

export async function requestComputer(userId, cartId) {
    try {
        const response = await fetch("https://secure-track-db.vercel.app/computers/request", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                cartId: parseInt(cartId),
            }),
        });
        return response;
    } catch (error) {
        console.error("Error al solicitar computadora:", error);
        throw error;
    }
}

export async function returnComputer(userId, cartId) {
    try {
        const response = await fetch("https://secure-track-db.vercel.app/computers/request-return", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                cartId: parseInt(cartId),
            }),
        });
        return response;
    } catch (error) {
        console.error("Error al devolver computadora:", error);
        throw error;
    }
}

export async function getCarros() {
    // Simulación de la función getCarros
    try {
        const response = await fetch("https://secure-track-db.vercel.app/rooms");
        if (!response.ok) {
            throw new Error("Error al obtener carros");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al realizar el fetch de carros:", error);
        throw error;
    }
}
