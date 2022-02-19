const router = require("express").Router();
const { catchErrors } = require("../handler/errorHandler");
const userController = require("../controllers/userCtrl");

const auth = require("../middlewares/auth");

router.post("/login", catchErrors(userController.login));
router.post("/sign-up", catchErrors(userController.register));
router.get("/:id", auth, catchErrors(userController.userInfo));

module.exports = router;
