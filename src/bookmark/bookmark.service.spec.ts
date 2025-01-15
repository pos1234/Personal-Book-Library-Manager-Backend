import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { BookmarkDto, PaginationDto, SearchBooksDto } from './dto';
import { ConfigService } from '@nestjs/config';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'DATABASE_URL') {
                return 'postgresql://postgres:root@localhost:5432/bookLibrary?schema=public'; // Provide a mock connection string
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
    prisma = module.get<PrismaService>(PrismaService);
  });

 
  const singleBookmark = {
    id: 1,
    createdAt: new Date('2024-01-14T21:00:00.000Z'),
    updatedAt: new Date('2024-01-15T21:00:00.000Z'),
    userId: 1,
    title: 'New Bookmark',
    author: 'Jane Doe',
    key: '/key/Wz123x',
    ISBN: '978-3-16-148410-0',
    coverId: 23457,
    readStatus: false,
    rating: 4,
    notes: 'Interesting read',
  };

  const searchBookmarks = [singleBookmark];
  describe('searchBookmarks', () => {
    it('should return paginated bookmarks', async () => {
      const mockTotalCount = 1;

      jest
        .spyOn(prisma.bookmarks, 'findMany')
        .mockResolvedValue(searchBookmarks);
      jest.spyOn(prisma.bookmarks, 'count').mockResolvedValue(mockTotalCount);

      const pagination: PaginationDto = { page: 1, limit: 10 };
      const searchCriteria: SearchBooksDto = { title: 'Test Bookmark' };

      const result = await service.searchBookmarks(
        1,
        pagination,
        searchCriteria,
      );

      expect(result).toEqual({
        data: searchBookmarks,
        total: mockTotalCount,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOneBookmark', () => {
    it('should return a single bookmark', async () => {
      jest
        .spyOn(prisma.bookmarks, 'findMany')
        .mockResolvedValue(searchBookmarks);

      const result = await service.findOneBookmark(1, '/key/Wy787g');
      expect(result).toEqual(searchBookmarks);
    });
  });

  describe('createBookmark', () => {
    it('should create a new bookmark', async () => {
      const newBookmark: BookmarkDto = {
        title: 'New Bookmark',
        author: 'Jane Doe',
        key: '/key/Wz123x',
        ISBN: '978-3-16-148410-0',
        coverId: 23457,
        readStatus: false,
        rating: 4,
        notes: 'Interesting read',
      };
      const mockBookmark = { id: 1, ...newBookmark };
      jest.spyOn(prisma.bookmarks, 'create').mockResolvedValue(singleBookmark);

      const result = await service.createBookmark(1, newBookmark);
      expect(result).toEqual(singleBookmark);
    });
  });

  describe('updateBookmark', () => {
    it('should update an existing bookmark', async () => {
      jest
        .spyOn(prisma.bookmarks, 'findUnique')
        .mockResolvedValue(singleBookmark);
      jest.spyOn(prisma.bookmarks, 'update').mockResolvedValue(singleBookmark);

      const result = await service.updateBookmark(1, 1, singleBookmark);
      expect(result).toEqual(singleBookmark);
    });

    it('should throw ForbiddenException if user does not own bookmark', async () => {
      jest.spyOn(prisma.bookmarks, 'findUnique').mockResolvedValue(null);

      await expect(
        service.updateBookmark(1, 1, singleBookmark),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteBookmark', () => {
    it('should delete a bookmark', async () => {
      const mockBookmark = { id: 1, userId: 1 };
      jest
        .spyOn(prisma.bookmarks, 'findUnique')
        .mockResolvedValue(singleBookmark);
      jest.spyOn(prisma.bookmarks, 'delete').mockResolvedValue(singleBookmark);

      const result = await service.deleteBookmark(1, 1);
      expect(result).toEqual(singleBookmark);
    });

    it('should throw ForbiddenException if user does not own bookmark', async () => {
      jest.spyOn(prisma.bookmarks, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteBookmark(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
