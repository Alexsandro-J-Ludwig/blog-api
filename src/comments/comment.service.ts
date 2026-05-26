import { Injectable } from "@nestjs/common";
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
}
