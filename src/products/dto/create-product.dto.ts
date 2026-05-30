import { Type } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    stock!: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    priceUnit!: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    categoryId!: number;
}