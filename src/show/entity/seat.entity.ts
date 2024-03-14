import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Show } from './show.entity';
import { Ticket } from './ticket.entity';

@Entity({name: 'seats'})
export class Seat {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Show, (show) => show.seat)
  @JoinColumn({ name: 'showId' })
  show: Show;

  @Column({ type: 'int', nullable: false })
  showId: number;

  @OneToMany(() => Ticket, (ticket) => ticket.seats)
  ticket: Ticket[];
  
  @Column({ type: 'varchar', nullable: false })
  grade: string;

  @Column({ type: 'int', nullable: false })
  seatNum: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}