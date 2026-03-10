import e from 'express'
import { singleurl } from '../Controllers/urlController.js'

let router=e.Router()

router.post("/add",singleurl)

export default router