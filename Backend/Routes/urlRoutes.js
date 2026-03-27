import e from 'express'
import { listUrls, retryUrl, singleurl } from '../Controllers/urlController.js'

let router=e.Router()

router.get("/list",listUrls)
router.post("/add",singleurl)
router.post("/retry/:id",retryUrl)

export default router
