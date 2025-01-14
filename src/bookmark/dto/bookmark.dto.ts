import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class BookmarkDto {
  @ApiPropertyOptional({ title: 'Title of bookmark', example: "The Great Gatsby" })
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiPropertyOptional({ title: 'Author of bookmarked item ', example: "Elon Musk" })
  @IsString()
  @IsNotEmpty()
  author: string;
  
  @ApiPropertyOptional({ title: 'ISBN of bookmarked item ', example: "978-3-16-148410-0" })
  @IsString()
  @IsOptional()
  ISBN: string;

  @ApiPropertyOptional({ title: 'Key of bookmarked item ', example: "/key/Wy787g" })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiPropertyOptional({ title: 'Cover id of bookmarked item ', example: 23457 })
  @IsInt()
  @IsOptional()
  coverId: number;
  
  @ApiPropertyOptional({ title: 'Read status of bookmarked item ', example: true })
  @IsBoolean()
  @IsOptional()
  readStatus: boolean;
  
  @ApiPropertyOptional({ title: 'Rating of bookmarked item ', example: 3 })
  @IsInt()
  @IsOptional()
  rating: number;
  
  @ApiPropertyOptional({ title: 'Note about bookmarked item ', example: "A thought-provoking book about the American Dream." })
  @IsString()
  @IsOptional()
  notes: string;
}

export class PaginationDto {
  @ApiPropertyOptional({ title: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class SearchBooksDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  ISBN?: string;
}