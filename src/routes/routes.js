import express from "express";
import {getIndex} from "../controllers/indexController.js";
import {getWebhook, postWebhook} from "../controllers/messengerController.js";
let expressRouter = express.Router();

export const initRoutes=(app)=>{
    expressRouter.get("/",getIndex);
    expressRouter.get("/webhook",getWebhook);
    expressRouter.post("/webhook",postWebhook);
    return app.use("/",expressRouter);
}

