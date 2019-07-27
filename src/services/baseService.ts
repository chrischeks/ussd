import chalk = require('chalk');
import { BasicResponse } from "../dtos/output/basicResponse";
import { Status } from "../dtos/enums/statusenum";
import { NextFunction, Request, Response } from "express";


export class BaseService {

    protected errors;

    protected hasErrors(errors: any) : boolean {
        return !(errors === undefined || errors.length == 0)
    }

    protected sendError(req: Request, res: Response, next : NextFunction, data?: Object) {

        var dat = {
            status : 400,
            data: data
        }
        res.status(401);
        res.send(dat);
        
    }

    public sendResponse(serviceResponse: BasicResponse, req: Request, res: Response): any {
        var response = {
          status : serviceResponse.getStatusString() ,
          data: serviceResponse.getData()
        }
    
        res.status(this.getHttpStatus(serviceResponse.getStatusString()));
    
        console.log('responding with', response);
        res.json(response);
    }

    protected sendException(ex, serviceResponse: BasicResponse, req: Request, res: Response, next: NextFunction): any {
        console.log(chalk.default.blue.bgRed.bold(ex));
        this.sendResponse(serviceResponse, req, res);
    }

   
    
    private getHttpStatus(status: string): number {
        switch(status){
            case 'SUCCESS':
                return 200;
            case 'CREATED':
                return 201;
            case 'NOT_FOUND':
                return 404;
            case 'FAILED_VALIDATION':
                return 400;
            case 'CONFLICT':
                return 409;
            case 'FORBIDDEN':
                return 403;
            case 'PRECONDITION_FAILED':
                return 412;
            case 'SUCCESS_NO_CONTENT':
                return 204;
            default:
                return 500;
        }
    }
    
    protected logInfo(info: string){
        console.log(chalk.default.blue.bgGreen.bold(info));
    }

    protected logError(error: string){
        console.log(chalk.default.blue.bgRed.bold(error));
    }

    protected getDuplicateError(fileName: string): any {
        return {'property' : 'fileName', 'constraints' : {'unique' : 'must be unique'}, value : fileName };
    }
   

}