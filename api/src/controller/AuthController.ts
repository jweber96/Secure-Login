import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if Email and Password are set
    let { email, password, code } = req.body;
    if (!(email && password && code)) {
      res.status(400).send();
    }

    //Get User from database
    const UserRepository = getRepository(User);
    let user: User;
    try {
      user = await UserRepository.findOneOrFail({ where: { Email: email } });
    } catch (error) {
      res.status(401).send();
    }

    //Check if encrypted Password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    //Check if 2FA code is valid
    if (!user.checkIfCodeIsValid(code)) {
      res.status(401).send();
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.Id, email: user.Email },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send(token);
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.UserId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get User from the database
    const UserRepository = getRepository(User);
    let user: User;
    try {
      user = await UserRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old Password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (Password lenght)
    user.Password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new Password and save
    user.hashPassword();
    UserRepository.save(user);

    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.UserId;

    //Get parameters from the body
    const { Password } = req.body;
    if (!Password) {
      res.status(400).send();
    }

    //Get User from the database
    const UserRepository = getRepository(User);
    let user: User;
    try {
      user = await UserRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if Password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(Password)) {
      res.status(401).send();
      return;
    }

    //Remove the User
    await UserRepository.remove(user);    

    //Redirect back to root
    res.redirect('/');
  };
}
export default AuthController;