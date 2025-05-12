import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(page: number = 1, searchQuery?: string) {
    try {
      const pageSize = 9;
      const skip = (page - 1) * pageSize;

      const whereCondition: Prisma.ProductWhereInput = searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              {
                Category: {
                  name: { contains: searchQuery, mode: 'insensitive' },
                },
              },
              { flower_color: { contains: searchQuery, mode: 'insensitive' } },
              {
                flowering_period: {
                  contains: searchQuery,
                  mode: 'insensitive',
                },
              },
              {
                planting_period: { contains: searchQuery, mode: 'insensitive' },
              },
              { exposure: { contains: searchQuery, mode: 'insensitive' } },
              { hardiness: { contains: searchQuery, mode: 'insensitive' } },
            ],
          }
        : {};

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          take: pageSize,
          skip: skip,
          where: whereCondition,
          include: {
            Image: true,
            Category: true,
          },
        }),
        this.prisma.product.count({
          where: whereCondition,
        }),
      ]);

      return {
        data: products,
        meta: {
          currentPage: page,
          pageSize,
          totalItems: total,
          totalPages: Math.ceil(total / pageSize),
          hasMore: skip + products.length < total,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findWithQuery(page = 1, category: number[]) {
    try {
      const pageSize = 9;
      const skip = (page - 1) * pageSize;

      const whereCondition: Prisma.ProductWhereInput = {
        category: {
          in: category.length > 0 ? category : undefined,
        },
      };

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          take: pageSize,
          skip,
          where: whereCondition,
          include: { Image: true, Category: true },
        }),
        this.prisma.product.count({
          where: whereCondition,
        }),
      ]);

      return {
        data: products,
        meta: {
          currentPage: page,
          pageSize,
          totalItems: total,
          totalPages: Math.ceil(total / pageSize),
          hasMore: skip + products.length < total,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  findOne(id: number) {
    try {
      return this.prisma.product.findUnique({
        where: { id },
        include: { Image: true },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  remove(id: number) {
    try {
      return this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getBestSellers(): Promise<Product[]> {
    try {
      const allProductIds = await this.prisma.product.findMany({
        select: {
          id: true,
        },
      });

      if (!allProductIds || allProductIds.length === 0) {
        return [];
      }

      const numberOfProductsToSelect = Math.min(4, allProductIds.length);
      const randomIds = new Set<number>();
      const idsArray = allProductIds.map((p) => p.id);

      while (randomIds.size < numberOfProductsToSelect) {
        const randomIndex = Math.floor(Math.random() * idsArray.length);
        randomIds.add(idsArray[randomIndex]);
      }

      const selectedIds = Array.from(randomIds);

      const bestSellers = await this.prisma.product.findMany({
        where: {
          id: {
            in: selectedIds,
          },
        },
        include: {
          Image: true,
        },
      });

      if (!bestSellers || bestSellers.length === 0) {
        throw new NotFoundException(
          `Could not find products for the selected IDs.`,
        );
      }

      return bestSellers;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
