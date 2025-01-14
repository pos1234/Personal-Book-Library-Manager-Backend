import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports:[JwtModule.register({})],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
