import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entity/show.entity';
import { DataSource, Repository } from 'typeorm';
import { Seat } from './entity/seat.entity';
import { Ticket } from './entity/ticket.entity';
import { User } from 'src/user/entity/user.entity';
import { CreateShowDto } from './dto/create-show.dto';
import _ from 'lodash';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show) private readonly showRepository : Repository<Show>,
    @InjectRepository(Seat) private readonly seatRepository : Repository<Seat>,
    @InjectRepository(Ticket) private readonly ticketRepository : Repository<Ticket>,
    @InjectRepository(User) private readonly userRepository : Repository<User>,
    private readonly dataSource : DataSource
  ) {}

  async createShow(user : User, createShowDto : CreateShowDto) {
    const show = this.showRepository.create({
      user,
      showName : createShowDto.showName,
      description : createShowDto.description,
      category : createShowDto.category,
      showDate : createShowDto.showDate,
      location : createShowDto.location
    });

    await this.showRepository.save(show);  

    const seat = createShowDto.seatInfo.map(idx => {
      const { seatNum, grade, price } = idx;
      const seatEntity = this.seatRepository.create({ seatNum, grade, price , show });
      seatEntity.show = show;
      return seatEntity;
    });

    await this.seatRepository.save(seat);
    return show;
  }

  async searchShow(search : string) {
    const query = this.showRepository.createQueryBuilder('shows')
                    .select(['id', 'show_name', 'show_date', 'category', 'location'])
                    .where('show_name like :search', {search : `%${search}`});
    return await query.getRawMany();
  }

  async detailShow(showId : number) {
    const show = await this.showRepository.findOneBy({ id : showId });
    
    if (_.isNil(show)) {
      throw new NotFoundException('조회할 수 없습니다.');
    }
    return show;
  }
  
  async searchTicket(showId : number) {
    const seat = this.seatRepository
                      .createQueryBuilder('seats')
                      .select([
                        'seats.id as seatId',
                        'seats.grade as grade',
                        'seats.seat_num as seatNum',
                        'seats.price as price',
                        'CONVERT_TZ(shows.show_date, "+00:00", "+09:00") AS show_date'
                      ])
                      .leftJoin('shows', 'shows', 'shows.id = seats.show_id')
                      .where('seats.showId = :showId', { showId })
                      .groupBy('seats.id, seats.grade, seats.seat_num, seats.price, shows.show_date')
                      .getRawMany();
    if (_.isEmpty(seat)) {
      throw new NotFoundException('예매 가능한 좌석 정보가 없습니다.');
    }
    return seat;
  }

  async createTicket(user: User, seatId: number, showId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const existingTicket = await this.ticketRepository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.seats', 'seat')
            .leftJoin('seat.show', 'show')
            .where('ticket.seatId = :seatId', { seatId })
            .andWhere('show.id = :showId', { showId })
            .orderBy('ticket.created_at', 'DESC')
            .getOne();


        if (existingTicket && existingTicket.cancelYn === false) {
            throw new NotFoundException('이미 예매된 좌석입니다.');
        }
        if (existingTicket && existingTicket.user.id === user.id) {
            throw new ForbiddenException('이미 예매되었습니다.');
        }

        const showDate = existingTicket ? existingTicket.seats.show.showDate : null;

        const currentTime = new Date();
        const isBeforeThreeHours = showDate && currentTime.getTime() < showDate.getTime() - 3 * 60 * 60 * 1000;
        const isBeforeShowTime = showDate && currentTime.getTime() < showDate.getTime();

        if (isBeforeThreeHours || isBeforeShowTime) {
            throw new ForbiddenException('티켓 예매가 불가능합니다.');
        }
        if (user.point < existingTicket.seats.price) {
            throw new BadRequestException('사용자의 포인트가 부족합니다.');
        }

        const newTicket = this.ticketRepository.create({
            user,
            seats: existingTicket.seats,
            cancelYn: false,
        });

        user.point -= existingTicket.seats.price;
        await this.userRepository.save(user);
        await queryRunner.commitTransaction();

        return this.ticketRepository.save(newTicket);

    } catch (err) {
        await queryRunner.rollbackTransaction();
        console.log("에러 메시지" + err);
        throw new InternalServerErrorException('서버 에러가 발생했습니다.', err);
    } finally {
        await queryRunner.release();
    }
}

  async updateTicket(user : User, ticketId : number) {
    const ticket = await this.ticketRepository.findOneBy({ id : ticketId});

    if (!ticket) {
      throw new NotFoundException('티켓이 존재하지 않습니다.');
    }
    if (ticket.user.id !== user.id) {
      throw new ForbiddenException('해당 티켓을 취소할 권한이 없습니다.');
    }
    if (ticket.cancelYn) {
      throw new BadRequestException('이미 취소된 티켓입니다.');
    }

    ticket.cancelYn = true;
    await this.ticketRepository.save(ticket);
  }
}