import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    OneToMany
  } from "typeorm";
  import { Length, IsNotEmpty, IsEmail } from "class-validator";
  import { Note } from './Note';
  import * as bcrypt from "bcryptjs";
  const otplib = require('otplib');
  
  @Entity()
  @Unique(["Email"])
  export class User {
    @PrimaryGeneratedColumn()
    Id: number;
  
    @Column()
    @IsEmail()
    Email: string;
  
    @Column()
    @Length(255)
    Password: string;

    @Column()
    @Length(255)
    TotpSecret: string;

    @Column()
    @Length(255)
    FirstName: string;

    @Column()
    @Length(255)
    LastName: string;

    @Column()
    @Length(10)
    Phone: string;
  
    @Column()
    @IsNotEmpty()
    Role: number;
  
    @Column()
    @CreateDateColumn()
    CreatedAt: Date;

    @OneToMany(type => Note, Note => Note.User)
    Notes: Note[];
  
    hashPassword() {
      this.Password = bcrypt.hashSync(this.Password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.Password);
    }

    checkIfCodeIsValid(code: string) {
      return otplib.authenticator.check(code, this.TotpSecret);
    }
  }