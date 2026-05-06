import { Body, Controller, HttpException, HttpStatus, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { AuthGuard } from "./auth.guard.js";

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

    @Post('/users/login')
    async getUser(@Body() body: any) {
        if (!body.email || !body.password) {
            throw new HttpException(
                'Missing required fields: email, password',
                HttpStatus.BAD_REQUEST
            );
        }

        const user = await this.userService.getUser(body);
        return user;
    }

    @UseGuards(AuthGuard)
    @Put('/users/update')
    async updateUser(@Body() data: any, @Req() req: any) {
        const uuid = req.user.id;

        const response = await this.userService.updateUser(uuid, data);
        return response;
    }
}