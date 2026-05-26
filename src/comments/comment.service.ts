import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./comments.entity.js";
import { UserService } from "src/user/user.service.js";
import { PostService } from "src/post/post.service.js";
import { CommentDTO } from "./comment.dto.js";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly userService: UserService,
        private readonly postService: PostService
    ) { }

    async createComment(data: CommentDTO, userUUID: string) {
        const user = await this.userService.find(userUUID);
        const post = await this.postService.find(data.postUuid);

        const newComment = this.commentRepository.create({
            ...data,
            owner: user,
            post: post
        });

        return await this.commentRepository.save(newComment);
    }

    async getCommentsByUser(userUUID: string) {
        const user = await this.userService.find(userUUID);

        return await this.commentRepository.find({
            where: {
                owner: { uuid: user.uuid },
            },
            relations: ['owner']
        });
    }

    async getAll(postUUID: string) {
        const comments = await this.commentRepository.find({
            where: {
                post: { uuid: postUUID }
            },
            relations: ['owner']
        });

        if (!comments || comments.length === 0) {
            throw new HttpException('Comments not found', 404);
        }

        return comments;
    }

    async updateComment(commentUUID: string, data: any) {
        const comment = await this.commentRepository.findOne({ where: { uuid: commentUUID } });
        if (!comment) {
            throw new HttpException('Comment not found', 404);
        }

        const alterations: any = {};
        const messageAlterations: string[] = [];

        if (data.content !== undefined && data.content !== comment.content) {
            alterations.content = data.content;
            messageAlterations.push('content');
        }

        if (data.image !== undefined && data.image !== comment.image) {
            alterations.image = data.image;
            messageAlterations.push('image');
        }

        if (messageAlterations.length === 0) {
            throw new HttpException('No valid fields to update', 400);
        }

        await this.commentRepository.update({ uuid: commentUUID }, alterations);

        return {
            message: "Comment updated successfully",
            updatedFields: messageAlterations
        };
    }
}
