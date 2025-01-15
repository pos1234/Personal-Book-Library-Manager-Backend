import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto, PaginationDto, SearchBooksDto } from './dto';
import { ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '../../src/bookmark/strategy';

describe('BookmarkController', () => {
  let controller: BookmarkController;
  let service: BookmarkService;

  const mockBookmarkService = {
    searchBookmarks: jest.fn(),
    findOneBookmark: jest.fn(),
    createBookmark: jest.fn(),
    updateBookmark: jest.fn(),
    deleteBookmark: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [
        {
          provide: BookmarkService,
          useValue: mockBookmarkService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<BookmarkController>(BookmarkController);
    service = module.get<BookmarkService>(BookmarkService);
  });
  const dto: BookmarkDto = {
    title: 'New Bookmark',
    author: 'Jane Doe',
    key: '/key/Wz123x',
    ISBN: '978-3-16-148410-0',
    coverId: 23457,
    readStatus: false,
    rating: 4,
    notes: 'Interesting read',
  };
  describe('findAllBookmarks', () => {
    it('should return a paginated list of bookmarks', async () => {
      const userId = 1;
      const paginationDto: PaginationDto = { limit: 10, page: 1 };
      const searchBooksDto: SearchBooksDto = { title: 'test' };
      const mockResponse = {
        data: [{ id: 1, title: 'Bookmark 1' }],
        total: 1,
        totalPages: 1,
      };

      mockBookmarkService.searchBookmarks.mockResolvedValue(mockResponse);

      const result = await controller.findAllBookmarks(
        userId,
        paginationDto,
        searchBooksDto,
      );
      expect(result).toEqual(mockResponse);
      expect(mockBookmarkService.searchBookmarks).toHaveBeenCalledWith(
        userId,
        paginationDto,
        searchBooksDto,
      );
    });
  });

  describe('findOneBookmark', () => {
    it('should return a specific bookmark', async () => {
      const userId = 1;
      const bookmarkId = 'abc123';
      const mockBookmark = { id: bookmarkId, title: 'Bookmark 1' };

      mockBookmarkService.findOneBookmark.mockResolvedValue(mockBookmark);

      const result = await controller.findOneBookmark(userId, bookmarkId);
      expect(result).toEqual(mockBookmark);
      expect(mockBookmarkService.findOneBookmark).toHaveBeenCalledWith(
        userId,
        bookmarkId,
      );
    });
  });

  describe('createBookmark', () => {
    it('should create a bookmark successfully', async () => {
      const userId = 1;
      const mockBookmark = { id: 1, userId, ...dto };
      mockBookmarkService.createBookmark.mockResolvedValue(mockBookmark);

      const result = await controller.createBookmark(userId, dto);
      expect(result).toEqual(mockBookmark);
      expect(mockBookmarkService.createBookmark).toHaveBeenCalledWith(
        userId,
        dto,
      );
    });
  });

  describe('updateBookmark', () => {
    it('should update a bookmark successfully', async () => {
      const userId = 1;
      const bookmarkId = 1;
      const mockUpdatedBookmark = { id: bookmarkId, userId, ...dto };

      mockBookmarkService.updateBookmark.mockResolvedValue(mockUpdatedBookmark);

      const result = await controller.updateBookmark(userId, bookmarkId, dto);
      expect(result).toEqual(mockUpdatedBookmark);
      expect(mockBookmarkService.updateBookmark).toHaveBeenCalledWith(
        userId,
        bookmarkId,
        dto,
      );
    });

    it('should throw ForbiddenException if user does not own bookmark', async () => {
      const userId = 1;
      const bookmarkId = 1;
      mockBookmarkService.updateBookmark.mockRejectedValue(
        new ForbiddenException('Access to resource denied'),
      );

      await expect(
        controller.updateBookmark(userId, bookmarkId, dto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

    describe('deleteBookmark', () => {
      it('should delete a bookmark successfully', async () => {
        const userId = 1;
        const bookmarkId = 1;

        mockBookmarkService.deleteBookmark.mockResolvedValue({ message: 'Bookmark deleted' });

        const result = await controller.deleteBookmark(userId, bookmarkId);
        expect(result).toEqual({ message: 'Bookmark deleted' });
        expect(mockBookmarkService.deleteBookmark).toHaveBeenCalledWith(userId, bookmarkId);
      });

      it('should throw ForbiddenException if user does not own the bookmark to delete', async () => {
        const userId = 1;
        const bookmarkId = 1;

        mockBookmarkService.deleteBookmark.mockRejectedValue(
          new ForbiddenException('Access to resource denied'),
        );

        await expect(controller.deleteBookmark(userId, bookmarkId)).rejects.toThrow(
          ForbiddenException,
        );
      });
    });
});
