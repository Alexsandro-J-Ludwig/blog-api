import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity.js";
import { Repository } from "typeorm";
import bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
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

    async getUser(user: any) {
        const findUser = await this.userRepository.findOne({ where: { email: user.email } });
        if (!findUser) {
            throw new HttpException('User not found', 404);
        }

        const passwordMatch = await bcrypt.compare(user.password, findUser.password);
        if (!passwordMatch) {
            throw new HttpException('Invalid password', 401);
        }

        const jwtPayload = { id: findUser.uuid, username: findUser.username, image: findUser.image };
        const token = await this.jwtService.signAsync(jwtPayload, { expiresIn: '3d', secret: process.env.JWT_SECRET });

        return { message: "User authenticated successfully", token };
    }

}