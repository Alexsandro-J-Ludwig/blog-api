import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { User } from '../user/user.entity.js';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  describe: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.posts)
  owner: Relation<User>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @ManyToMany(() => User)
  @JoinTable({ name: 'post_likes' })
  likedBy: Relation<User[]>;
}
