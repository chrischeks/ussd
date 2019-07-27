import { Length, IsNotEmpty, IsString, IsOptional, IsNumber, IsNumberString } from "class-validator";
 
export class CreateBookDTO {
 
    
    @IsNotEmpty({
        message: "Book's name is required"
    })
    @Length(1, 100, {
        message: "Book's name should be between 1 and 100 characters"
     })
    name: string; 

    @IsNotEmpty({
        message: "Author's name is required"
    })
    @Length(2, 100, {
        message: "Author's name should be between 2 and 100 characters"
     })
    author: string;

    @IsNotEmpty({
        message: "Publisher is required"
    })
    @Length(3, 100, {
        message: "publisher should be between 3 and 100 characters"
     })
    publisher: string; 


    @IsNotEmpty({
        message: "Publish year is required"
    })
    @IsNumberString({
        message: "Publish year must be a number"
    })
    @Length(3, 100, {
        message: "publish year should be between 3 and 100 characters"
     })
    publish_year: string; 


    constructor(name?: string, author?: string, publisher?: string, publish_year?: string){
        this.name = name;
        this.author = author;
        this.publisher = publisher;
        this.publish_year = publish_year;
    }
}