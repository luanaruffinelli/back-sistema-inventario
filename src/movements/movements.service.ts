import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovementDto, MovementType } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovementsService {
  constructor(private prismaService: PrismaService) { }

  async create(createMovementDto: CreateMovementDto) {
    try {

      // Validar si hay stock suficiente
      const product = await this.prismaService.product.findUnique({
        where: {
          id: createMovementDto.productId,
        }
      });

      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      if (product.stock < createMovementDto.amount && createMovementDto.type === MovementType.OUT) {
        throw new BadRequestException('No hay stock suficiente');
      }


       const transaction = await this.prismaService.$transaction(async (tx) => {

        const newMovement = await tx.movement.create({
          data: {
            ...createMovementDto,
            date: new Date(createMovementDto.date),
          }
        })

        const newStock = createMovementDto.type === MovementType.IN ? product.stock + createMovementDto.amount : product.stock - createMovementDto.amount;

        await tx.product.update({
          where: {
            id: createMovementDto.productId,
          },
          data: {
            stock: newStock,
          }
        })

        return newMovement;
      })

      return transaction;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prismaService.movement.findMany();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.movement.findUnique({
        where: {
          id,
        }
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: number, updateMovementDto: UpdateMovementDto) {
    const movement = await this.findOne(id);

    try {
      if (!movement) {
        throw new NotFoundException('Movimiento no encontrado');
      }

      // Validar si hay stock suficiente
      const product = await this.prismaService.product.findUnique({
        where: {
          id: updateMovementDto.productId,
        }
      });

      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      if (!updateMovementDto.amount) {
        throw new Error('La cantidad es obligatoria');
      }

      if (product.stock < updateMovementDto.amount && updateMovementDto.type === MovementType.OUT) {
        throw new Error('No hay stock suficiente');
      }

      return await this.prismaService.movement.update({
        where: {
          id,
        },
        data: {
          ...updateMovementDto,
          date: new Date(updateMovementDto.date!),
        }
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.movement.delete({
        where: {
          id,
        }
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}