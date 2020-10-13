import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
const otplib = require('otplib');
import { User } from "../entity/User";
import { Note } from "../entity/Note";

export class CreateAdminUser21574742598150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let note = new Note();
        let user = new User();
        user.Email = "alec.timothy.bell@gmail.com";
        user.Password = "admin";
        user.hashPassword();
        user.TotpSecret = otplib.authenticator.generateSecret();
        user.FirstName = "Alec";
        user.LastName = "Bell";
        user.Phone = "+15137061124"
        user.Role = 1;
        user.Notes = [note];
        note.Note = "My first note.";
        note.User = user;

        const userRepository = getRepository(User);
        await userRepository.save(user);

        const noteRepository = getRepository(Note);
        await noteRepository.save(note);
    }
    
    public async down(queryRunner: QueryRunner): Promise<any> {}

}
