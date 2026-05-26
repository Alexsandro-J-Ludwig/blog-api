import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from './comments.entity.js';
import { CommentController } from './comment.controller.js';
import { CommentService } from './comment.service.js';
import { UserModule } from 'src/user/user.module.js';
import { PostModule } from 'src/post/post.module.js';

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), UserModule, PostModule],
    controllers: [CommentController],
    providers: [CommentService]
})
export class CommentModule { }
