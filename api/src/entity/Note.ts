import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne
  } from "typeorm";
  import { Length } from "class-validator";
  import { User } from './User';
  
  @Entity()
  export class Note {
    @PrimaryGeneratedColumn()
    Id: number;
  
    @Column()
    @Length(120)
    Note: string;
  
    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    @ManyToOne(type => User, User => User.Notes)
    User: User;
  }