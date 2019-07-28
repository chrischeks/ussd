import { NextFunction, Request, Response, Router } from "express";
import { ussdMenuService } from '../services/ussdMenuService';






export class UssdController {


  public loadRoutes(prefix: String, router: Router) {

    this.ussdMenuRoute(prefix, router);
    
    
  }



  


  public ussdMenuRoute(prefix: String, router: Router): any {

    router.post(prefix , (req, res: Response, next: NextFunction) => {
      new ussdMenuService().ussdMenu(req, res, next);
    })
  }



 


}

