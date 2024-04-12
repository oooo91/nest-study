import { Body, Controller, Get, HttpStatus, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { UserInfo } from 'src/common/decorator/userInfo.decorator';
import { User } from './entity/user.entity';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UserController {
  constructor( private readonly userService : UserService ) {}

  @Post('signup')
  async signUp(@Body() signupDto : SignUpDto, @Res() res : Response) {
    return res.status(HttpStatus.CREATED).json({
      message : "회원가입이 완료되었습니다",
      user : await this.userService.signUp(signupDto)
    })
  }

  @Post('signin')
  async signIn(@Body() SignInDto : SignInDto, @Res() res : Response) {
    return res.status(HttpStatus.OK).json({
      message : "로그인이 완료되었습니다",
      accessToken : await this.userService.signIn(SignInDto)
    })
  }

  @UseGuards(RolesGuard)
  @Get('profile')
  async getProfile(@UserInfo() user : User) {
    return await this.userService.getProfile(user);
  }

  @UseGuards(RolesGuard)
  @Put('profile')
  async updateProfile(@UserInfo() user : User, @Body() updateprofileDto : UpdateProfileDto, @Res() res : Response) {
    return res.status(HttpStatus.OK).json({
      message : "프로필이 수정되었습니다.",
      user : await this.userService.updateProfile(user, updateprofileDto)
    });
  }
}