
import { BaseService } from "./baseService";
import { BasicResponse } from "../dtos/output/basicResponse";
import { Status } from '../dtos/enums/statusenum';
import { NextFunction, Request, Response } from "express";
import { validateSync, validate } from "class-validator";
import { CreateBookDTO } from '../dtos/input/book/createBookDTO';


export class BookService extends BaseService {

    async createBook(req: Request, res: Response, next: NextFunction) {

        try {
            const { name, author, publisher, publish_year} = req.body
            const dto = new CreateBookDTO(name, author, publisher, publish_year)
            console.log(dto)
            let errors = await this.validateBook(dto);
            if (this.hasErrors(errors)) {
                return this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), req, res);
            }

            const book = req.app.locals.book({ name, author, publisher, publish_year })
            book.save().then(result => {
                if (result) {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, result), req, res);
                } else {
                    this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION), req, res);
                }
            }).catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), req, res);

            })


        } catch (ex) {
            this.sendResponse(new BasicResponse(Status.ERROR, ex), req, res);

        }
    }



    async getBooks(req: Request, res: Response, next: NextFunction) {

        try {

            await req.app.locals.book.find().then(result => {
                if (result.length > 0) {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, result), req, res);
                } else {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, []), req, res);
                }
            }).catch(err => {
                this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, err), req, res);

            })


        } catch (ex) {
            this.sendResponse(new BasicResponse(Status.ERROR, ex), req, res);

        }
    }

    async deleteBook(req: Request, res: Response, next: NextFunction) {

        try {

            await req.app.locals.book.deleteOne({_id: req.params.id}).then(result => {
                if (result) {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, ["successfully deleted"]), req, res);
                } else {
                    this.sendResponse(new BasicResponse(Status.NOT_FOUND), req, res);
                }
            }).catch(err => {
                this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, err), req, res);

            })


        } catch (ex) {
            this.sendResponse(new BasicResponse(Status.ERROR, ex), req, res);

        }
    }


    // async editAuthor(req: Request, res: Response, next: NextFunction) {

    //     try {
    //         const { name, books, phone, age, address } = req.body
    //         const dto = new EditAuthorDTO(name, books, phone, age, address)
    //         let errors = await this.validateAuthor(dto);
    //         if (this.hasErrors(errors)) {
    //             await this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), req, res);
    //             return next();
    //         }

    //         let foundAuthor= null;
    //         await req.app.locals.author.findOne({ _id: req.params.id }).then(result => {
    //                 if (result) {
    //                     foundAuthor = result
                       
    //                 } else {
    //                     this.sendResponse(new BasicResponse(Status.NOT_FOUND), req, res);
    //                 }
    //             }).catch(err => {
    //                 this.sendResponse(new BasicResponse(Status.ERROR, err), req, res);

    //             })

    //             if(foundAuthor){
    //                 foundAuthor.name = dto.name;
    //                 foundAuthor.books = dto.books,
    //                 foundAuthor.phone = dto.phone,
    //                 foundAuthor.age = dto.age,
    //                 foundAuthor.address = dto.address
                
    //                 await foundAuthor.save().then(result => {
    //                     if (result) {
    //                         this.sendResponse(new BasicResponse(Status.SUCCESS, result), req, res);
    //                     } else {
    //                         this.sendResponse(new BasicResponse(Status.PRECONDITION_FAILED), req, res);

    //                     }
    //                 }).catch(err=>{
    //                     this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, err), req, res);
    //                 })
    //             }


    //     } catch (ex) {
    //         this.sendResponse(new BasicResponse(Status.ERROR, ex), req, res);

    //     }
    // }

    async validateBook(dto) {
        let errors = await validate(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }
    }
}
