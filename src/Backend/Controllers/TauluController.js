const HttpError = require('../Models/http-error');
const Taulut = require('../Models/TauluModels');
const mongoose = require('mongoose');


const HaeTaulunTiedot = async (req, res, next) => {

    let TaulunTiedot;
    try {
        TaulunTiedot = await Taulut.find();
    } catch (err) {
        const error = new HttpError("error", 201);
        return next(error);
    }
    if (!TaulunTiedot || TaulunTiedot.length === 0) {
        const error = new HttpError("Tauluun ei löydetty tietoja", 404);
        return next(error);
    }
    res.json(TaulunTiedot);
}
const UpdateTaulu = async (req, res, next) => {
    const { rivit, solut } = req.body;
    const ValittuID = req.params._id;
    try {
        const TaulunTieto = await Taulut.findById(ValittuID);
        if (TaulunTieto) {

            TaulunTieto.rivit = rivit;
            TaulunTieto.solut = solut;
            await TaulunTieto.save();
            res.json({ Taulut: TaulunTieto.toObject({ getters: true }) })
        }
        else {
            const error = HttpError("Taulua ei löydy", 404);
            return next(error);
        }
    } catch {

    }

}
const CreateNewTaulu = async (req, res, next) => {
    const { rivit, solut, solujenArvot } = req.body;

    if (!rivit || !solut || !solujenArvot) {
        const error = new HttpError("TÄYTÄ", 413);
        return next(error);
    }

    const TaulunUusiId = new mongoose.Types.ObjectId().toHexString();

    const LuoTaulu = new Taulut({
        _id: TaulunUusiId,
        rivit: rivit,
        solut: solut,
        solujenArvot: solujenArvot,
    });

    try {
        await LuoTaulu.save();
        res.status(201).json(LuoTaulu);
    } catch (err) {
        // console.error(err.message);
        const error = new HttpError("Taulua ei voitu lisätä tietokantaan", 500);
        return next(error);
    }
}
const getByID = async (req, res, next) => {

    const TauluID = req.params._id;

    if (!TauluID) {
        const error = new HttpError('Taulua ei löydy', 400);
        return next(error);
    }
    let taulu
    try {
        taulu = await Taulut.findOne({ _id: TauluID });
    } catch {
        const error = new HttpError('Taulua ei löydy', 500);
        return next(error);
    }
    res.json(taulu);
}

const updateSolunArvo = async (req, res, next) => {
    const value = req.body.value;
    console.log(value)
    const TauluID = req.params._id;
    console.log("TauluID:", TauluID);
    try {
        const SolunTiedot = await Taulut.findOneAndUpdate(
            { 'solujenArvot._id': TauluID },
            { $set: { 'solujenArvot.$.value': value } },
            { new: true }
        );
        console.log("SolunTiedot:", SolunTiedot);
        if (SolunTiedot) {
            SolunTiedot.value = value;
            await SolunTiedot.save();
            res.json({ Taulut: SolunTiedot.toObject({ getters: true }) });
        } else {
            const error = new HttpError("Taulua ei löydy", 404);
            return next(error);
        }
    } catch (error) {
        console.error(error);
        const responseError = new HttpError("Internal Server Error", 500);
        return next(responseError);
    }
};
exports.HaeTaulunTiedot = HaeTaulunTiedot;
exports.UpdateTaulu = UpdateTaulu;
exports.CreateNewTaulu = CreateNewTaulu;
exports.getByID = getByID;
exports.updateSolunArvo = updateSolunArvo;