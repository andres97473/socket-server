import { Router, Request, Response } from "express";
import { GraficaData } from "../classes/grafica";
import { GraficaData2 } from "../classes/grafica2";
import Server from "../classes/server";
import { usuariosConectados } from "../sockets/socket";

const router = Router();

const grafica = new GraficaData();
const grafica2 = new GraficaData2();

// retornar grafica 1 linecharts
router.get("/grafica", (req: Request, res: Response) => {
  res.json(grafica.getDataGrafica());
});

// retornar grafica 2 barcharts
router.get("/grafica2", (req: Request, res: Response) => {
  res.json(grafica2.getDataGrafica());
});

// aumentar valor de grafica 1 linecharts
router.post("/grafica", (req: Request, res: Response) => {
  const { mes, unidades } = req.body;

  grafica.incrementarValor(mes, Number(unidades));

  const server = Server.instance;
  server.io.emit("cambio-grafica", grafica.getDataGrafica());

  res.json(grafica.getDataGrafica());
});

// augmentar valor de grafica 2 barcharts
router.post("/grafica2", (req: Request, res: Response) => {
  const { posicion, unidades } = req.body;

  grafica2.incrementarValor(Number(posicion), Number(unidades));

  const server = Server.instance;
  server.io.emit("cambio-grafica2", grafica2.getDataGrafica());

  res.json(grafica2.getDataGrafica());
});

// mensajes a usuario por id de sesion
router.post("/mensajes/:id", (req: Request, res: Response) => {
  const { cuerpo, de } = req.body;
  const id = req.params.id;

  const payload = {
    de,
    cuerpo,
  };

  const server = Server.instance;
  server.io.in(id).emit("mensaje-privado", payload);

  res.json({
    ok: true,
    cuerpo,
    de,
    id,
  });
});

// obtener todos los ids de los usuarios
router.get("/usuarios", (req: Request, res: Response) => {
  const server = Server.instance;

  let clientes: any[] = [];

  server.io.sockets.sockets.forEach((socket) => {
    clientes.push(socket.id);
  });
  res.json({
    ok: true,
    clientes,
  });
});
// obtener usuarios y sus nombres
router.get("/usuarios/detalle", (req: Request, res: Response) => {
  res.json({
    ok: true,
    clientes: usuariosConectados.getLista(),
  });
});

export default router;
