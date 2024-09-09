    let text = document.getElementById("text")    
    let res = localStorage.getItem("correctKey")

    let qr = document.getElementById("qr");
    let timerDisplay = document.getElementById("time");

    // Función para manejar el temporizador
    function startTimer(duration, display, callback) {
        let timer = duration, minutes, seconds;
        let interval = setInterval(function () {
            minutes = Math.floor(timer / 60);
            seconds = timer % 60;

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(interval);
                callback(); // Ejecutar la función cuando el tiempo llegue a 0
            }
        }, 1000);
    }

    // Función que se ejecuta cuando el temporizador termina

document.getElementById("close-btn").addEventListener("click", closeModal)
    function closeModal() {
        modal.style.display = "none";
    }

    async function onTimerFinish(params) {
        
    }

    // Iniciar el temporizador con 5 minutos
    window.onload = async function () {
      let data = await fetch("https://secure-track-db.vercel.app/computers/time",
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: JSON.parse(res).tokenId,
            }),
        }
      )
        if ((await data).status === 200) {
            let horario = await data.json();
            console.log(horario)
            horario = 300 - horario.time
            startTimer(horario, timerDisplay, onTimerFinish);
        }else{
            let horario = await data.json();
            time.innerText = horario
        }
    };
    
    let img = document.createElement("img")
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.parse(res).tokenId)}`
    qr.appendChild(img)
    text.innerText = `El slot para el retiro es el ${JSON.parse(res).slot}`
