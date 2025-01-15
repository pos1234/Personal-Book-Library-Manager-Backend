import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookmarkDto, PaginationDto, SearchBooksDto } from './dto';
import { BookmarkService } from './bookmark.service';
import { AuthGuard } from '../bookmark/strategy';

@UseGuards(AuthGuard)
@Controller('bookmarks/user/:userId/')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Get()
  findAllBookmarks(@Param('userId', ParseIntPipe) userId: number,@Query() paginationDto: PaginationDto,@Query() searchBooksDto: SearchBooksDto) {
    return this.bookmarkService.searchBookmarks(userId,paginationDto,searchBooksDto);
  }

  @Get(':id')
  findOneBookmark(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('key') bookmarkId: string,
  ) {
    return this.bookmarkService.findOneBookmark(userId, bookmarkId);
  }

  @Post()
  createBookmark(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: BookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(':id')
  updateBookmark(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: BookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(userId, bookmarkId, dto);
  }

  @Delete(':id')
  deleteBookmark(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }
}
