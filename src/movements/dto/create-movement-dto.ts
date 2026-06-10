import { MovementType } from "@generated";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateMovementDto {
    @IsEnum(MovementType, { message: 'El tipo de movimiento no es válido' })
    type!: MovementType;

    @IsDateString({strict: true }, { message: 'La fecha no es válida' })
    date!: string;

    @Type(() => Number)
    @IsInt({ message: 'El cantidad no es válida' })
    @Min(0, { message: 'El cantidad no puede ser negativo' })
    amount!: number;

    @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
    @Type(() => Number)
    @IsNumber()
    priceUnit!: number;

    @IsNotEmpty({ message: 'El producto es obligatorio' })
    @Type(() => Number)
    @IsNumber()
    productId!: number;

    @IsNotEmpty({ message: 'El usuario es obligatorio' })
    @Type(() => Number)
    @IsNumber()
    userId!: number;
}