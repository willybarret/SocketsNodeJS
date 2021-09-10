const { Socket } = require("net");
const colors = require("colors");
const escanearDeLaConsola = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

const socket = new Socket();
const host = "localhost";
const puerto = 7777;
const finalizarConeccion = "!salir";

socket.connect({
    port: puerto,
    host: host
});
socket.setEncoding("utf-8");

socket.on("connect", () => {
    console.log("Usted se ha conectado al servidor.".green);
    console.log(
        `Hola! El funcionamiento es sencillo.\nIngresa tu nombre y comienza a chatear!\nSi deseas desconectarte escribe: !salir`.cyan
    );
    escanearDeLaConsola.question("Ingrese su nombre de usuario: ", (nombre) => {
        socket.write(nombre);
    });
    
    escanearDeLaConsola.on("line", (mensaje) => {
        socket.write(mensaje);
        if(mensaje === finalizarConeccion) {
            socket.end();
        }
    });
    
    socket.on("data", (datos) => {
        console.log(datos);
    });
    
    socket.on("close", () => {
        console.log("Usted se ha desconectado del servidor.".red);
        process.exit(0);
    });
})