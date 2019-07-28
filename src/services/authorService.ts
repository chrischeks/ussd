
import { BaseService } from "./baseService";
import { BasicResponse } from "../dtos/output/basicResponse";
import { Status } from '../dtos/enums/statusenum';
import { NextFunction, Request, Response } from "express";
import { CreateAuthorDTO } from '../dtos/input/author/createAuthorDTO';
import { validateSync, validate } from "class-validator";
import { EditAuthorDTO } from '../dtos/input/author/editAuthorDTO';


export class AuthorService extends BaseService {

    async createAuthor(req: Request, res: Response, next: NextFunction) {

        try {
            const { name, books, phone, age, address } = req.body
            const dto = new CreateAuthorDTO(name, books, phone, age, address)
            let errors = await this.validateAuthor(dto);
            if (this.hasErrors(errors)) {
                await this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), req, res);
                return next();
            }

            const author = req.app.locals.author({ name, books, phone, age, address })
            author.save().then(result => {
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



    async getAuthors(req: Request, res: Response, next: NextFunction) {

        try {

            await req.app.locals.author.find().then(result => {
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

    async deleteAuthor(req: Request, res: Response, next: NextFunction) {

        try {

            await req.app.locals.author.deleteOne({ _id: req.params.id }).then(result => {
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


    public async editAuthor(req: Request, res: Response, next: NextFunction) {

        const { name, books, phone, age, address } = req.body
        let dto = new EditAuthorDTO(name, books, phone, age, address)
        let errors = await this.validateAuthor(dto);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), req, res);
            return next();
        }
        await this.processUpdateAuthor(req, res, dto)
    }


    async processUpdateAuthor(req, res, dto: EditAuthorDTO) {
        try {
            let foundAuthor = null;
            await req.app.locals.author.findById(req.params.id).then(result => {
                if (result) {
                    foundAuthor = result

                } else {
                    this.sendResponse(new BasicResponse(Status.NOT_FOUND), req, res);
                }
            }).catch(err => {
                this.sendResponse(new BasicResponse(Status.ERROR, err), req, res);

            })

            foundAuthor.name = dto.name;
            foundAuthor.books = dto.books;
            foundAuthor.phone = dto.phone;
            foundAuthor.age = dto.age;
            foundAuthor.address = dto.address

            await foundAuthor.save().then(result => {
                if (result) {
                    this.sendResponse(new BasicResponse(Status.SUCCESS, result), req, res);
                } else {
                    this.sendResponse(new BasicResponse(Status.PRECONDITION_FAILED), req, res);
                }
            }).catch(err => {
                this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, err), req, res);
            })

        } catch (error) {

        }

    }


    async validateAuthor(dto) {
        let errors = await validate(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }
    }
}
