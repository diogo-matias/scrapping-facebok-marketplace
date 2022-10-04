import { Request, Response } from "express";

class FacebookController {
  post(req: Request, res: Response) {
    const teste = req.path;
    res.json(teste);
  }
}

module.exports = FacebookController;
