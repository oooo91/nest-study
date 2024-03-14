import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Seat } from './seat.entity';

@Entity({name : 'shows'})
export class Show {

  @PrimaryGeneratedColumn()
  id : number;

  @ManyToOne(() => User, (user) => user.show)
  @JoinColumn({name : 'userId'})
  user : User;

  @Column({type : 'int', nullable : false})
  userId : number;

  @OneToMany(() => Seat, (seat) => seat.show)
  seat: Seat[];
  
  @Column({type : 'varchar', nullable : false})
  showName : string;

  @Column({ type: 'datetime', nullable: false }) 
  showDate: Date; 

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