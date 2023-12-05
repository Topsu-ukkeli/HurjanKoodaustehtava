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
    if (!TaulunTiedot || TaulunTiedot.length == 0) {
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
    const { rivit, solut } = req.body;
    if (!rivit || !solut) {
        const error = new HttpError("TÄYTÄ", 413);
        return next(error);
    }
    else {
        const TaulunUusiId = new mongoose.Types.ObjectId().toHexString();
        const LuoTaulu = new Taulut({
            _id: TaulunUusiId,
            rivit: rivit,
            solut: solut,
        });
        try {
            try {
                await LuoTaulu.save();
            }
            catch (err) {

            }
        } catch {
            const error = new HttpError("Taulua ei voitu lisätä tietokantaan", 500);
            return next(error);
        }
        res.status(201).json(LuoTaulu);

    }

}

exports.HaeTaulunTiedot = HaeTaulunTiedot;
exports.UpdateTaulu = UpdateTaulu;
exports.CreateNewTaulu = CreateNewTaulu;