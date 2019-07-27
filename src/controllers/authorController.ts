import { NextFunction, Request, Response, Router } from "express";
import { AuthorService } from '../services/authorService';






export class AuthorController {


    public loadRoutes(prefix: String, router: Router) {

        this.createAuthorRoute(prefix, router);
        this.editAuthorRoute(prefix, router)
        this.getAuthorsRoute(prefix, router)
        this.deleteAuthorRoute(prefix, router)
    }


    public createAuthorRoute(prefix: String, router: Router): any {
        router.post(prefix + "/create", (req, res: Response, next: NextFunction) => {
            new AuthorService().createAuthor(req, res, next);
        })
    }

    public editAuthorRoute(prefix: String, router: Router): any {
        router.put(prefix + "/edit/:id", (req, res: Response, next: NextFunction) => {
            new AuthorService().editAuthor(req, res, next);
        })
    }

    public getAuthorsRoute(prefix: String, router: Router): any {
        router.get(prefix + "/", (req, res: Response, next: NextFunction) => {
            new AuthorService().getAuthors(req, res, next);
        })
    }

    public deleteAuthorRoute(prefix: String, router: Router): any {
        router.delete(prefix + "/delete/:id", (req, res: Response, next: NextFunction) => {
            new AuthorService().deleteAuthor(req, res, next);
        })
    }





}

