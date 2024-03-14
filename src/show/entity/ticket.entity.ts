import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Seat } from './seat.entity';
import { User } from 'src/user/entity/user.entity';

@Entity({name: 'tickets'})
export class Ticket {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Seat, (seat) => seat.ticket)
  @JoinColumn({ name: 'seatId' })
  seats: Seat;

  @Column({ type: 'int', nullable: false })
  seatId: number;

  @ManyToOne(() => User, (user) => user.ticket)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @Column({ type: 'boolean', default: false, nullable: false })
  cancelYn: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
  
}