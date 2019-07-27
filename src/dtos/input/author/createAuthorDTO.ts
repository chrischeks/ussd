import { Length, IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";
 
export class CreateAuthorDTO {
 
    
    @IsNotEmpty({
        message: "Author's name is required"
    })
    @Length(2, 100, {
        message: "Author's name should be between 2 and 100 characters"
     })
    name: string; 

    @IsNotEmpty({
        message: "Book(s) written by the author is required"
    })
    books: string[];

    @IsNotEmpty({
        message: "Author's phone number is required"
    })
    @Length(11, 11, {
        message: "Author's phone number should be 11 numbers"
     })
    phone: string; 


    @IsOptional()
    @IsNumber({})
    age: number

    @IsOptional()
    @IsString({
        message: "Address should be a string"
    })
    address: string


    constructor(name: string, books: string[], phone: string, age?: number, address?: string){
        this.name = name;
        this.books = books;
        this.age = age;
        this.phone = phone;
        this.address = address
    }
}