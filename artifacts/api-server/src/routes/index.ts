import { Router, type IRouter } from "express";
import healthRouter from "./health";
import prospectsRouter from "./prospects";
import campaignsRouter from "./campaigns";
import emailsRouter from "./emails";
import dashboardRouter from "./dashboard";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(prospectsRouter);
router.use(campaignsRouter);
router.use(emailsRouter);
router.use(dashboardRouter);
router.use(openaiRouter);

export default router;
