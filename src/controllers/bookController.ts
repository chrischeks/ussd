import { NextFunction, Request, Response, Router } from "express";
import { AuthorService } from '../services/authorService';
import { BookService } from '../services/bookService';






export class BookController {


    public loadRoutes(prefix: String, router: Router) {

        this.createBookRoute(prefix, router);
        this.editBookRoute(prefix, router)
        this.getBooksRoute(prefix, router)
        this.deleteBookRoute(prefix, router)
    }


    public createBookRoute(prefix: String, router: Router): any {
        router.post(prefix + "/create", (req, res: Response, next: NextFunction) => {
            new BookService().createBook(req, res, next);
        })
    }

    public editBookRoute(prefix: String, router: Router): any {
        router.put(prefix + "/edit/:id", (req, res: Response, next: NextFunction) => {
           // new BookService().editAuthor(req, res, next);
        })
    }

    public getBooksRoute(prefix: String, router: Router): any {
        router.get(prefix + "/", (req, res: Response, next: NextFunction) => {
            new BookService().getBooks(req, res, next);
        })
    }

    public deleteBookRoute(prefix: String, router: Router): any {
        router.delete(prefix + "/delete/:id", (req, res: Response, next: NextFunction) => {
            new BookService().deleteBook(req, res, next);
        })
    }





}

