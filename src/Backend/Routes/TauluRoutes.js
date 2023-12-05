const express = require('express');
const TauluControllers =require('../Controllers/TauluController');

const router = express.Router();

router.get('/HaeTauluunTiedot/', TauluControllers.HaeTaulunTiedot);
router.put('/update/:_id',TauluControllers.UpdateTaulu)
router.post('/createTaulu',TauluControllers.CreateNewTaulu)
module.exports = router;