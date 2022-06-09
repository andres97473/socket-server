import { Router, Request, Response } from "express";
import Server from "../classes/server";
import { usuariosConectados } from "../sockets/socket";

const router = Router();

router.get("/mensajes", (req: Request, res: Response) => {
  res.json({
    ok: true,
    mensaje: "GET - Listo",
  });
});

// mensajes a todos los usuarios
router.post("/mensajes", (req: Request, res: Response) => {
  const { cuerpo, de } = req.body;

  const payload = {
    de,
    cuerpo,
  };

  const server = Server.instance;
  server.io.emit("mensaje-nuevo", payload);

  res.json({
    ok: true,
    cuerpo,
    de,
  });
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
