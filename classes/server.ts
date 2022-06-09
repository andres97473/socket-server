import express from "express";
import { SERVER_PORT } from "../global/environment";
import { Server as socketIO } from "socket.io";
import http from "http";

import * as socket from "../sockets/socket";

export default class Server {
  private static _instance: Server;

  public app: express.Application;
  public port: number;

  public io: socketIO;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;

    this.httpServer = new http.Server(this.app);

    this.io = new socketIO(this.httpServer, {
      cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
      },
    });

    this.escucharSockets();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private escucharSockets() {
    console.log("Escuchando conexiones - sockets");

    this.io.on("connection", (cliente) => {
      // console.log("Cliente conectado");

      // console.log(cliente.id);

      socket.conectarCliente(cliente, this.io);

      // Configurar usuario
      socket.configurarUsuario(cliente, this.io);

      // Obtener usuarios
      socket.obtenerUsuarios(cliente, this.io);

      // Mensajes
      socket.mensaje(cliente, this.io);

      // Desconectar
      socket.desconectar(cliente, this.io);
    });
  }

  start(callback: Function) {
    this.httpServer.listen(this.port, callback());
  }
}
