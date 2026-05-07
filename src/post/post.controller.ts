import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service.js";
import { AuthGuard } from "src/user/auth.guard.js";
import { PostDTO } from "./Post.dto.js";

@Controller('post')
export class PostController{
    provider: PostService;
    constructor(private readonly postService: PostService){}

    @UseGuards(AuthGuard)
    @Post("/create")
    async createPost(@Body() postDto: PostDTO, @Req() req: any){
        const uuid = req.user.uuid;

        const response = await this.postService.createPost(postDto, uuid);

        return response;
    }

    @UseGuards(AuthGuard)
    @Get("/getByUser")
    async getByUser(@Req() req: any) {
        const uuid = req.user.uuid

        const response = await this.postService.getPostByUser(uuid);
        return response;
    }

    @Get("/getAll")
    async getAll() {
        const response = await this.postService.getAllPosts();
        return response
    }
}