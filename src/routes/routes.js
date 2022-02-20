import express from "express";
import {getIndex} from "../controllers/indexController.js";

let expressRouter = express.Router();

export const initRoutes=(app)=>{
    expressRouter.get("/",getIndex);

    return app.use("/",expressRouter);
}

