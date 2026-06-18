import express from "express"
import { createuser, deleteuser, getuser, getuserid, login, profile, updatePassword, updateuser } from "../Controllers/usercontroller.js"
import { requireAdmin, requireAuth } from "../middleware.js"

const router = express.Router()

router.post('/register', createuser)
router.post('/login', login)
router.get('/profile', requireAuth, profile)
router.get('/getallusers', requireAuth, requireAdmin, getuser)
router.get('/getuser/:user_id', getuserid)
router.put( '/updatepassword', requireAuth, updatePassword )
router.put('/updateuser/:user_id', requireAuth, updateuser)
router.delete('/deleteuser/:user_id', requireAuth, requireAdmin, deleteuser)

export default router;