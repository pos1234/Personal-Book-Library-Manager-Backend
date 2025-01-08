import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto, PaginationDto } from './dto';

@Injectable({})
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  //retrieve bookmarks
  async findAllBookmarks(userId: number, paginationDto: PaginationDto) {
    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 10;
    const [bookmarks, total] = await Promise.all([
      this.prisma.bookmark.findMany({
        where: {
          userId,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.bookmark.count(),
    ]);
    return {
      data: bookmarks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  //retrieve single bookmark
  async findOneBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findMany({
      where: {
        id: bookmarkId,
        userId,
      },
    });
    return bookmark;
  }

  //create bookmark
  async createBookmark(userId: number, dto: BookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  //update bookmark
  async updateBookmark(userId: number, bookmarkId: number, dto: BookmarkDto) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  //delete bookmark
  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }
    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
