import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './post.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule { }
