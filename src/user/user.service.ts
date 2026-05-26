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

        const jwtPayload = { id: findUser.uuid, uuid: findUser.uuid, username: findUser.username, image: findUser.image };
        const token = await this.jwtService.signAsync(jwtPayload, { expiresIn: '3d', secret: process.env.JWT_SECRET });

        return { message: "User authenticated successfully", token };
    }

    async updateUser(uuid: string, data: any) {
        const alterations = {};
        const messageAlterations: string[] = [];

        const user = await this.userRepository.findOne({ where: { uuid } });
        if (!user) {
            throw new HttpException('User not found', 404);
        }

        if (data.username) {
            alterations['username'] = data.username;
            messageAlterations.push('username');
        }

        if (data.email) {
            alterations['email'] = data.email;
            messageAlterations.push('email');
        }

        if (data.password) {
            if (data.password.length < 6) {
                throw new HttpException('Password must be at least 6 characters long', 400);
            }
            alterations['password'] = await bcrypt.hash(data.password, 10);
            messageAlterations.push('password');
        }

        if (data.image) {
            alterations['image'] = data.image;
            messageAlterations.push('image');
        }

        if (messageAlterations.length === 0) {
            throw new HttpException('No valid fields to update', 400);
        }

        await this.userRepository.update({ uuid }, alterations);

        return {
            message: "User updated successfully",
            updatedFields: messageAlterations
        };
    }

    async deleteUser(uuid: string) {
        const userCheck = await this.userRepository.findOne({ where: { uuid }});

        if (!userCheck) {
            throw new HttpException("User not found", 404);
        }

        await this.userRepository.delete({uuid});

        return { menssage: "User deleted with sucessful"};
    }
}