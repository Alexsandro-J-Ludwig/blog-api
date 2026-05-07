import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Post } from "./post.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostDTO } from "./Post.dto.js";
import { User } from "src/user/user.entity.js";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly userRepository: Repository<User>
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

    async getAllPosts() {
        try {
            const posts = await this.postRepository.find({
                order: {
                    date: "DESC"
                },
                relations: ['owner']
            });

            return posts;

        } catch (error) {
            throw new HttpException(
                "The platform is experiencing instabilities. Please try again later.",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getByUsername(username: string) {
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new HttpException(
                "User not find",
                HttpStatus.NOT_FOUND
            )
        }

        const posts = await this.postRepository.find({
            where: {
                owner: {
                    uuid: user.uuid
                }
            },
            relations: ['owner'],
            order: {
                date: "DESC"
            }
        })

        return posts;
    }

    async updatePost(data: any, uuidPost: string, uuid: string) {
        const post = await this.postRepository.findOne({ where: { uuid: uuidPost } });

        if (!post) {
            throw new HttpException(
                "Post not find",
                HttpStatus.NOT_FOUND
            )
        }

        let updateFields = {};
        let fildsUpdate: number[] = []

        if (data.title) {
            updateFields["title"] = data.title
            fildsUpdate.push(1);
        }
        if (data.describe) {
            updateFields["describe"] = data.describe
            fildsUpdate.push(2);
        }
        if (data.image) {
            updateFields["image"] = data.image
            fildsUpdate.push(3);
        }

        if (fildsUpdate.length === 0) {
            return { message: "Any fields updated" }
        }

        await this.postRepository.update({ uuid: uuidPost }, updateFields);
        return { message: "Fields updated with sucessful" };
    }

    async likePost(uuidPost: string, uuidUser: string) {
        const post = await this.postRepository.findOne({
            where: { uuid: uuidPost },
            relations: ['likedBy']
        });

        if (!post) {
            throw new HttpException("Post not found", HttpStatus.NOT_FOUND);
        }
        const alreadyLiked = post.likedBy.some(user => user.uuid === uuidUser);

        if (alreadyLiked) {
            post.likedBy = post.likedBy.filter(user => user.uuid !== uuidUser);
            post.likes--;
        } else {
            post.likedBy.push({ uuid: uuidUser } as User);
            post.likes++;
        }

        return await this.postRepository.save(post);
    }

    async deletePost(uuidPost: string) {
        const checkPost = await this.postRepository.findOne({ where: { uuid: uuidPost } })

        if (!checkPost) {
            throw new HttpException(
                "Post not found",
                HttpStatus.NOT_FOUND
            )
        }

        await this.postRepository.delete({ uuid: uuidPost });
        return { message: "Post deleted with sucessful" };
    }
}