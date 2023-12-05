const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Taulu = require('./Routes/TauluRoutes');
const HttpError = require("./Models/http-error");
const cors = require('cors');
const server = express();

server.use(bodyParser.json());
server.use(cors());
server.use("/", Taulu)
server.use(() => {
    const error = new HttpError("Pääsy evätty", 418);
    throw error;
})
server.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "Virhe!" });
});
mongoose
    .connect('mongodb+srv://Topi_Leinonen:UuX9SliuhVJjLEMw@cluster0.yx4cexu.mongodb.net/Taulu?retryWrites=true&w=majority')
    .then(() => {
        console.log("Päästiin sisään")
        server.listen(5000);
    })
    .catch(error => {
    })