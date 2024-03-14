import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CATEGORY } from '../enum/category.enum';
import { Type } from 'class-transformer';
import { SeatInfoDto } from './seatInfo.dto';

export class CreateShowDto {

  @IsString()
  @IsNotEmpty({message : "공연명을 입력하세요"})
  showName : string;

  @IsDateString()
  @IsNotEmpty({message : "공연날짜를 선택하세요"})
  showDate : Date;

  @IsString()
  @IsNotEmpty({message : "공연정보를 입력하세요"})
  description : string;

  @IsEnum(CATEGORY)
  @IsNotEmpty({message : "카테고리를 선택하세요"})
  category : string;

  @IsString()
  @IsNotEmpty({message : "공연장을 입력하세요"})
  location : string;

  @IsArray()
  @ValidateNested({ each: true }) 
  @Type(() => SeatInfoDto)
  seatInfo: SeatInfoDto[];

  image : string;
}