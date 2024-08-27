import { Router } from "express";
import productsRouter from "./products.routes.mjs";
import clientsRouter from "./clients.routes.mjs";

const router = Router();

router.use("/productos", productsRouter);
router.use("/clientes", clientsRouter);

export default router;
