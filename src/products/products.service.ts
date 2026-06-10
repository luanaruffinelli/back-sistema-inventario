import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    try {
      // Validar el correo electrónico
      const existingProduct = await this.prismaService.product.findFirst({
        where: {
          name: createProductDto.name,
        }
      });

      if (existingProduct) {
        throw new ConflictException('El producto con ese nombre ya está en uso');
      }

      return await this.prismaService.product.create({
        data: createProductDto
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prismaService.product.findMany({
        orderBy: {
          name: 'asc',
        },
        include: {
          category: true,
        }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.product.findUnique({
        where: {
          id,
        }
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    try {
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Validar el correo electrónico
      const existingProduct = await this.prismaService.product.findFirst({
        where: {
          name: updateProductDto.name,
        }
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('El nombre del producto ya está en uso');
      }

      return await this.prismaService.product.update({
        where: {
          id,
        },
        data: {
          ...updateProductDto,
        }
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.product.delete({
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