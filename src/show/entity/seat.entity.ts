import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Show } from './show.entity';
import { Ticket } from './ticket.entity';

@Entity({name: 'seats'})
export class Seat {

  @PrimaryGeneratedColumn()
  seat_id: number;

  @ManyToOne(() => Show, (show) => show.seat)
  @JoinColumn({ name: 'showId' })
  show: Show;

  @OneToMany(() => Ticket, (ticket) => ticket.seats)
  ticket: Ticket[];
  
  @Column({ type: 'varchar', nullable: false })
  grade: string;

  @Column({ type: 'int', nullable: false })
  seat_num: number;

  @Column({type : 'boolean', nullable : false, default : false })
  check_yn : boolean;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}