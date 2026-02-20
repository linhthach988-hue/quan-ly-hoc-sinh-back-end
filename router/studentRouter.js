var express = require("express");
var router = express.Router();
var ctrl = require("../controllers/studentController");

router.get("/init", ctrl.initializeDB);
router.get("/", ctrl.list);
router.post("/", ctrl.insert);
router.get("/:id", ctrl.detail);
router.post("/:id", ctrl.edit);
router.get("/delete/:id", ctrl.delete);

module.exports = router;
