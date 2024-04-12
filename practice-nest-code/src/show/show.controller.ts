import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ShowService } from './show.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';
import { UserInfo } from 'src/common/decorator/userInfo.decorator';
import { CreateShowDto } from './dto/create-show.dto';
import { User } from 'src/user/entity/user.entity';
import { Response } from 'express';
import { RolesGuard } from 'src/common/auth/roles.guard';

@UseGuards(RolesGuard)
@Controller('show')
export class ShowController {
  constructor(private readonly showService : ShowService) {}

  @Roles(Role.Admin)
  @Post() 
  async createShow(@UserInfo() user : User, 
                    @Body() createshowDto : CreateShowDto, @Res() res : Response) {                   
    return res.status(HttpStatus.CREATED).json({
      message : "공연이 등록되었습니다",
      data : await this.showService.createShow(user, createshowDto)
    });
  }

  @Get()
  async searchShow(@Query('search') search?: string) {
    return await this.showService.searchShow(search);
  }

  @Get(':showId')
  async detailShow(@Param('showId') showId: number) {
    return await this.showService.detailShow(showId);
  }

  @Get('ticket/:showId')
  async searchTicket(@Param('showId') showId: number) {
    return await this.showService.searchTicket(showId);
  }

  @Post('ticket/:seatId/:showId')
  async createTicket(@UserInfo() user: User,
                      @Param('showId') showId: number, 
                      @Param('seatId') seatId: number, 
                      @Res() res : Response) {
    return res.status(HttpStatus.CREATED).json({
      message : "예매가 완료되었습니다.",
      data : await this.showService.createTicket(user, seatId, showId)
    });
  }

  @Put('ticket/:seatId/:ticketId/:showId')
  async updateTicket(@UserInfo() user: User,
                      @Param('ticketId') ticketId: number,
                      @Res() res : Response) {                     
    await this.showService.updateTicket(user, ticketId);
    return res.status(HttpStatus.CREATED).json({
      message : "예매가 취소되었습니다.",
    });
  }

}
