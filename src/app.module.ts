import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller.js';
import { UserService } from './user/user.service.js';
import { User } from './user/user.entity.js';
import { UserModule } from './user/user.module.js';
import 'dotenv/config.js';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from './post/post.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
      maxQueryExecutionTime: 1000,
      retryAttempts: 3,
      retryDelay: 3000,
      poolSize: 10,
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    PostModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
