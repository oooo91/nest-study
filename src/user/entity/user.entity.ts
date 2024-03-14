import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enum/role.enum';
import { Show } from 'src/show/entity/show.entity';
import { Ticket } from 'src/show/entity/ticket.entity';

@Index('email', ['email'], {unique : true})
@Entity({name : 'users'})
export class User {

  @PrimaryGeneratedColumn()
  id : number;

  @Column({type : 'varchar', unique : true, nullable : false})
  email : string;

  @Column({type : 'varchar', select : true, nullable : false})
  password : string

  @Column({type : 'varchar', nullable : false})
  name : string;

  @Column({type : 'enum', enum : Role, default : Role.User})
  role : Role;

  @Column({type : 'int', default : 1000000, nullable : false})
  point : number;

  @Column({type : 'timestamp', default : () => 'CURRENT_TIMESTAMP'})
  created_at : Date;

  @OneToMany(() => Show, (show) => show.user)
  show: Show[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  ticket: Ticket[];
}