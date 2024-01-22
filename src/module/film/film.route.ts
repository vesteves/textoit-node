import { Request, Response, Router } from "express";

import { getMinMax } from './'

const router = Router()

router.get("/", async (_: Request, res: Response) => {
    try {
        const result = await getMinMax()
        return res.status(200).json(result)
    }
    catch (error: any) {
        return res.send(error)
    }
});

export default router