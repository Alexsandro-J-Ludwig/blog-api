import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { Post } from '../post/post.entity.js';
import { Comment } from '../comments/comments.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    default:
      'https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg',
  })
  image: string;

  @OneToMany(() => Post, (post) => post.owner)
  posts: Relation<Post[]>;

  @OneToMany(() => Comment, (comment) => comment.owner)
  comments: Relation<Comment[]>;
}
