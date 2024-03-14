import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entity/show.entity';
import { Seat } from './entity/seat.entity';
import { Ticket } from './entity/ticket.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Show, Seat, Ticket, User])],
  providers: [ShowService],
  controllers: [ShowController]
})
export class ShowModule {}