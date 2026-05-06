import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service.js";
import { AuthGuard } from "src/user/auth.guard.js";
import { PostDTO } from "./Post.dto.js";

@Controller('post')
export class PostController{
    provider: PostService;
    constructor(private readonly postService: PostService){}

    @UseGuards(AuthGuard)
    @Post("/create")
    async createPost(@Body() body: any, @Req() req: any){
        const uuid = req.user.uuid;

        const dto = new PostDTO(body);
        const response = await this.postService.createPost(dto, uuid);

        return response;
    }
}