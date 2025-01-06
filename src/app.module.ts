import { Module } from '@nestjs/common';
import { AuthoModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [AuthoModule, UserModule, BookmarkModule, PrismaModule],
})
export class AppModule {}
