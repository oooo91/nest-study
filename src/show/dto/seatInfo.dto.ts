import { IsNotEmpty } from 'class-validator';

export class SeatInfoDto {
  @IsNotEmpty({ message: '좌석 번호를 입력해주세요.' })
  seatNum: number;

  @IsNotEmpty({ message: '등급을 입력해주세요.' })
  grade: string;

  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  price: number;
}