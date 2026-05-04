import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "./user.service.js";

@Controller('')
export class UserController {
    provider: UserService;
    constructor(private readonly userService: UserService) { }

    @Post('/users/create')
    async createUser(@Body() body: any) {        
        if (!body.username
            || !body.email 
            || !body.password) {
            throw new HttpException(
                'Missing required fields: username, email, password', 
                HttpStatus.BAD_REQUEST
            );
        }
        
        const response = await this.userService.createUser(body);
        return response;
    }
}