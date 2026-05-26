import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service.js";
import { CommentDTO } from "./comment.dto.js";
import { AuthGuard } from "../user/auth.guard.js";

@Controller('comments')
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
}