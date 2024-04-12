import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signup.dto';
import { compare, hash } from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository : Repository<User>,
    private readonly jwtService : JwtService  
  ) {}

  async findByEmail(email : string) {
    return await this.userRepository.findOneBy({email});
  }

  async signUp(signupDto : SignUpDto) {
    if (signupDto.password !== signupDto.comfirmPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
    if (await this.findByEmail(signupDto.email)) {
      throw new ConflictException('이미 가입된 이메일 입니다.');
    };

    const user = await this.userRepository.save({
      email : signupDto.email,
      password : await hash(signupDto.password, 10),
      name : signupDto.name,
      role : signupDto.role,
      point : signupDto.point 
    });
    return user;
  }

  async signIn(signinDto : SignInDto) : Promise<string> {
    const user = await this.userRepository.findOne({
      select : ['id', 'email', 'password'],
      where : {email : signinDto.email}
    });

    if (_.isNull(user)) {
      throw new UnauthorizedException('이메일을 확인하세요.');
    }
    if (!(await compare(signinDto.password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인하세요.');
    }

    const payload = {email : signinDto.email, sub : user.id, role : user.role};
    const accessToken = this.jwtService.sign(payload, {expiresIn : '10m'});
  
    return accessToken ;
  }

  async getProfile(userInfo : User) {
    const user = await this.userRepository.findOne({
      select: ['email', 'name', 'point'],
      where : {id : userInfo.id}
    });

    if (_.isNull(user)) {
      throw new NotFoundException('사용자 정보가 없습니다.');
    }
    return user;
  }

  async updateProfile(userInfo : User, updateprofileDto : UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      select : ['email', 'name', 'point'],
      where : {id : userInfo.id}
    });

    if (_.isNull(user)) {
      throw new NotFoundException('사용자 정보가 없습니다.');
    }
    
    user.name = updateprofileDto.name;
    return await this.userRepository.save(user);
  }
}