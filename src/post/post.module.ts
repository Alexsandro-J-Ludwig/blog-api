import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './post.entity.js';
import { PostController } from './post.controller.js';
import { PostService } from './post.service.js';
import { UserModule } from 'src/user/user.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule { }
