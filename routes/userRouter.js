const express = require("express");
const { userController } = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getAll);
router.post("/login", userController.login);
router.post("/confirmcode", userController.confirmCode);

module.exports = router;

