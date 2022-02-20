import express from "express";
import {configViewEngine} from './config/configView.js';
import {initRoutes} from "./routes/routes.js";
import bodyParser from "body-parser";
import 'dotenv/config'

let app= express();

//configuring view engine
configViewEngine(app);

//body parser to post json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//initialize routes
initRoutes(app);

let port =process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(process.env.PORT)
})