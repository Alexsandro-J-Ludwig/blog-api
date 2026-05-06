import { HttpException, Injectable } from "@nestjs/common";
import { Post } from "./post.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostDTO } from "./Post.dto.js";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) { }

    async createPost(data: PostDTO, uuid) {
        const request = await this.postRepository.create({...data, uuid})

        if (!request) {
            throw new HttpException("Cannot possible create post now, try later", 500);
        }

        return { message: "Post create sucessful" };
    }
}