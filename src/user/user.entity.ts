import { Post } from 'src/post/post.entity.js';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string; 

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({  })
  password: string;

  @Column({ default: "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg" })
  image: string;

  @OneToMany(() => Post, (posts) => posts.owner)
  posts: Post;
}
