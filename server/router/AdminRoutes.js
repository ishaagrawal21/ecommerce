const express = require("express");
const router = express.Router();
const { getAdminStats, getAllUsers } = require("../controller/admin.controller");

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);

module.exports = router;
