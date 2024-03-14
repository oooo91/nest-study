import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../enum/role.enum';

export class SignUpDto {

  @IsEmail()
  @IsNotEmpty({message : '이메일을 입력해주세요'})
  email : string;

  @IsString()
  @IsNotEmpty({message : '비밀번호를 입력해주세요'})
  password : string;
  
  @IsString()
  @IsNotEmpty({message : '비밀번호를 확인하세요.'})
  comfirmPassword : string;

  @IsString()
  @IsNotEmpty({message : '이름을 작성해주세요'})
  name : string;

  @IsEnum(Role)
  @IsNotEmpty({message : '권한을 입력하세요'})
  role : Role;
  
  point : number;
}