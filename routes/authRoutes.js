const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/registerAzienda', authController.registerAzienda);

router.post("/login", authController.login )

router.post("/userData", authController.profilo)

router.post("/uploadImage", authController.uploadImmage)

router.get("/getImage", authController.getImmage)

router.post("/updateUser", authController.updateUser)

router.get('/verifyProtectedRoute', authController.verificaCookie, (req, res) => {
    res.send('Utente ' + req.user.email + ' autorizzato ad accedere')
  })


module.exports = router;