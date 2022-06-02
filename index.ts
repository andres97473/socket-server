import Server from "./classes/server";
import router from "./routes/router";
import bodyParser from "body-parser";
import cors from "cors";

const server = new Server();

// BodyParser - convertir lo que me enviar en el body en un objeto js
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// CORS - permitir peticiones desde otro dominio (localhost:4200)
server.app.use(cors({ origin: true, credentials: true }));

// Rutas de servicios
server.app.use("/", router);

server.start(() => {
  console.log(`Servidor corriendo en el puerto ${server.port}`);
});
