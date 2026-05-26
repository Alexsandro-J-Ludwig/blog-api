import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity.js';
import { UserModule } from './user/user.module.js';
import 'dotenv/config.js';
import { PostModule } from './post/post.module.js';
import { CommentModule } from './comments/comments.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
          autoLoadEntities: true,
          synchronize: true,
          maxQueryExecutionTime: 1000,
          retryAttempts: 3,
          retryDelay: 3000,
          poolSize: 10,
        }
        : {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true,
          maxQueryExecutionTime: 1000,
          retryAttempts: 3,
          retryDelay: 3000,
          poolSize: 10,
        },
    ),
    TypeOrmModule.forFeature([User]),
    UserModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule { }
