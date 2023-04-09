import { Router } from "express"
import { getSessions, createSession, updateSession, deleteSession, getSessionDetail} from "../controllers/session"

const router: Router = Router()

router.get("/sessions", getSessions)

router.get("/getSessionDetail", getSessionDetail)

router.post("/add-session", createSession)

router.put("/edit-session/:id", updateSession)

router.delete("/delete-session/:id", deleteSession)

export default router