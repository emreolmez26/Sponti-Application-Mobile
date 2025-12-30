const express = require("express");
const router = express.Router();
const { registerUser,loginUser } = require("../controller/authController");
const auth = require("../middleware/authMiddleware");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, (req, res) => {
  // Auth middleware'i token'ı çözdü ve bilgileri req.user içine koydu.
  // Biz de bunu frontend'e geri yolluyoruz.
  res.status(200).json(req.user); 
});

module.exports = router;
