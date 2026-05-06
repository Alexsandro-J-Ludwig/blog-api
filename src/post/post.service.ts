import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

    async createPost(data: PostDTO, userUuid: string) {
        try {
            const newPost = this.postRepository.create({
                ...data,
                owner: { uuid: userUuid }
            });

            await this.postRepository.save(newPost);

            return { message: "Post created successfully" };
        } catch (error) {
            throw new HttpException(
                "Could not create post, please try again later", 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getPostByUser(uuid: string) {
        const posts = await this.postRepository.find({
            where: {
                owner: { uuid: uuid }
            },
            relations: ['owner'],
            order: {
                date: 'DESC'
            }
        });

        if (!posts || posts.length === 0) {
            throw new HttpException("Cannot find any post for this user", 404);
        }
        
        return posts;
    }
}