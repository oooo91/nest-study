import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Seat } from './seat.entity';

@Entity({name : 'shows'})
export class Show {

  @PrimaryGeneratedColumn()
  show_id : number;

  @ManyToOne(() => User, (user) => user.show)
  @JoinColumn({name : 'userId'})
  user : User;

  @OneToMany(() => Seat, (seat) => seat.show)
  seat: Seat[];
  
  @Column({type : 'varchar', nullable : false})
  show_name : string;

  @Column({ type: 'datetime', nullable: false }) 
  show_date: Date; 

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}