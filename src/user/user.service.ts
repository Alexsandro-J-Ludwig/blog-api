import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity.js";
import { Repository } from "typeorm";
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async createUser(user: any) {
        if (await this.userRepository.findOne({ where: { username: user.username } })) {
            throw new HttpException('Username already exists', 400);
        }
        
        if (!user.password || user.password.length < 6) {
            throw new HttpException('Password must be at least 6 characters long', 400);
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUUser = await this.userRepository.create({ ...user, password: hashedPassword });
        await this.userRepository.save(newUUser);

        return { message: "User created successfully" };
    }

}