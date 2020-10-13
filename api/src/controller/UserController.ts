import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
const otplib = require('otplib');

import { User } from "../entity/User";
import { Note } from "../entity/Note";

class UserController{

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = +res.locals.jwtPayload.userId;

    //Get the User from database
    const UserRepository = getRepository(User);
    try {
      const user = await UserRepository.findOne({ 
        //select: ["Email", "FirstName", "LastName", "Phone", "Notes"],
        //relations: ["note"],
        where: { Id: id },
        join: {
          alias: "user",
          leftJoinAndSelect: {
              Notes: "user.Notes"
          }
        }
      });
      res.status(200).send(user);
    } catch (error) {
      res.status(404).send("User not found");
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { FirstName, LastName, Phone, Email, Password } = req.body;
    let user = new User();
    user.FirstName = FirstName;
    user.LastName = LastName;
    user.Phone = Phone;
    user.Email = Email;
    user.Password = Password;
    user.TotpSecret = otplib.authenticator.generateSecret();
    user.Role = 2;

    //Validade if the parameters are ok
    const errors = await validate(User);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Hash the Password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the Email is already in use
    const UserRepository = getRepository(User);
    try {
      await UserRepository.save(user);
    } catch (e) {
      res.status(409).send("Email already in use");
      return;
    }

    //If all ok, send 201 response
    res.status(201).send(user.TotpSecret);
  };

  static newNote = async (req: Request, res: Response) => {
    //Get parameters from the body
    let noteText = req.body.note;
    const id: number = +res.locals.jwtPayload.userId;

    const UserRepository = getRepository(User);
    const user = await UserRepository.findOne({ 
      where: { Id: id }
    });

    let note = new Note();
    note.Note = noteText;
    note.User = user;

    //Validade if the parameters are ok
    const errors = await validate(Note);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to save
    const NoteRepository = getRepository(Note);
    try {
      await NoteRepository.save(note);
    } catch (e) {
      res.status(404).send("Failed to save note");
      return;
    }

    //If all ok, send 201 response
    res.status(201).send("Note created");
  };
};

export default UserController;