import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;
}