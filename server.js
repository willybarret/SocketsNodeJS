const { Server } = require("net");
const moment = require("moment");
const colors = require("colors");

const servidor = new Server();

const host = "0.0.0.0";
const puerto = 7777;
const finalizarConexion = "!salir";

const conexiones = new Map();
const enviarMensaje = (autor, mensaje) => {
    for(const socketConexion of conexiones.keys()) {
        if (socketConexion !== autor) {
            socketConexion.write(
                `[` +
                moment().format("hh:mm") +
                `]` +
                `${mensaje}`
            );
        }
    }
}

servidor.on("connection", (socket) => {
    const socketRemoto = `${socket.remoteAddress}:${socket.remotePort}`;
    socket.setEncoding("utf-8");
    socket.on("data", (mensaje) => {
        if (!conexiones.has(socket)) {
            console.log(
                moment().format('DD-MM-YYYY').yellow +
                `::`.yellow +
                moment().format("hh:mm:ss").yellow +
                ` => `.yellow +
                `Se ha conectado: `.green +
                `@${mensaje}`.yellow  +
                ` desde: `.green +
                `${socketRemoto}`
            );
            conexiones.set(socket, mensaje);
        } else if (mensaje === finalizarConexion) {
            socket.end();
        } else {
            const mensajeCompleto = `[@${conexiones.get(socket)}]: `.bold + `${mensaje}`;
            console.log(
                moment().format('DD-MM-YYYY') +
                `::`
                + moment().format("hh:mm:ss") +
                ` => ` +
                `${mensajeCompleto}`
            );
            enviarMensaje(socket, mensajeCompleto);
        }
    });
    socket.on("close", () => {
        console.log(
            moment().format('DD-MM-YYYY').yellow +
            `::`.yellow +
            moment().format("hh:mm:ss").yellow +
            ` => `.yellow +
            `Se ha desconectado: `.red +
            `@${conexiones.get(socket)}`
        );
    });
});

servidor.listen({ port: puerto, host: host }, () => {
    console.log(
        `El servidor está escuchando en el puerto:` +
        ` ${puerto}`.green
    );
});