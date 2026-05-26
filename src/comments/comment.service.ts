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
        const user = this.userService.find(userUUID);

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        return await this.commentRepository.find({
            where: {
                owner: !(await user).uuid,
            }
        })
    }

    async getAll(postUUID: string) {
        const comments = await this.commentRepository.find({
            where: {
                post: !postUUID
            }
        })

        if (!comments || comments.length === 0) {
            throw new HttpException('Comments not found', 404);
        }

        return comments;
    }

    async updateComment(commentUUID: string, data: any) {
        const alterations: any = {};
        const messageAlterations: string[] = [];

        const comment = await this.commentRepository.findOne({ where: { uuid: commentUUID } });
        if (!comment) {
            throw new HttpException('Comment not found', 404);
        }

        const update = {
            content: (data.content) ? data.content : comment.content,
            image: (data.image) ? data.image : comment.image,
        }

        for (const key of Object.keys(update)) {
            if (update[key] !== comment[key]) {
                alterations[key] = update[key];
                messageAlterations.push(key);
            }
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
