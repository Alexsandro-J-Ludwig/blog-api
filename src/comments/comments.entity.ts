import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { User } from '../user/user.entity.js';
import { Post } from 'src/post/post.entity.js';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: true })
    image: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => User, (user) => user.comments)
    owner: Relation<User>;

    @ManyToOne(() => Post, (post) => post.comments)
    post: Relation<Post>;

    @Column({ type: 'int', default: 0 })
    likes: number;

    @ManyToMany(() => User)
    @JoinTable({ name: 'comment_likes' })
    likedBy: Relation<User[]>;

    @OneToMany(() => Comment, (comment) => comment.parent)
    replies: Relation<Comment[]>;

    @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE', nullable: true })
    parent: Relation<Comment>;
}
