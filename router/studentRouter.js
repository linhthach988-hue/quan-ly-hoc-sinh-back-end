var express = require("express");
var router = express.Router();
var ctrl = require("../controllers/studentController");

router.get("/", ctrl.list);
router.post("/", ctrl.insert);

module.exports = router;
