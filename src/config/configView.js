import express from "express";

//config view Engine

export const configViewEngine=(app)=>{
    app.use(express.static("./src/public"));
    app.set("view engine","ejs");
    app.set("views","../src/views");
}

