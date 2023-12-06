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
//tämä ei ole millään tavalla turvallinen tapa käyttää mongodb tietokantaa mutta tämä toimii tässä esimerkissä hyvin.
mongoose 
    .connect('mongodb+srv://Topi_Leinonen:UuX9SliuhVJjLEMw@cluster0.yx4cexu.mongodb.net/Taulu?retryWrites=true&w=majority')
    .then(() => {
        console.log("Yhteys tietokantaan luotu onnistuneesti")
        server.listen(5000);
    })
    .catch(error => {
        console.log("Yhteyden luonti tietokantaan epäonnistui!" + error);
    })