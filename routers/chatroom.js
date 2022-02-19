const router = require("express").Router();
const { catchErrors } = require("../handler/errorHandler");
const chatroomController = require("../controllers/chatroomCtrl");

const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(chatroomController.getAllChatrooms));
router.get("/:name/users", auth, catchErrors(chatroomController.getChatroomUsers));
router.post("/", auth, catchErrors(chatroomController.createChatroom));

module.exports = router;
