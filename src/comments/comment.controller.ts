import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service.js";
import { CommentDTO } from "./comment.dto.js";
import { AuthGuard } from "../user/auth.guard.js";

@Controller('/comments')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @UseGuards(AuthGuard)
    @Post("/create")
    async createComment(@Body() comment: CommentDTO, @Req() req: any) {
        const uuid = req.user.uuid;

        return await this.commentService.createComment(comment, uuid);
    }

    @UseGuards(AuthGuard)
    @Get('/user')
    async getCommentsByUser(@Req() req: any) {
        const uuid = req.user.uuid;

        return await this.commentService.getCommentsByUser(uuid);
    }

    @Get('/all/:uuid')
    async getAll(@Param('uuid') uuid: string) {
        return await this.commentService.getAll(uuid);
    }

    @Put('/update/:uuid')
    @UseGuards(AuthGuard)
    async updateComment(@Param('uuid') uuid: string, @Body() data: any, @Req() req: any) {
        return await this.commentService.updateComment(uuid, data);
    }
}