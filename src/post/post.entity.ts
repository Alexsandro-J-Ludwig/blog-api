import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity.js';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  uuid: string; 

  @Column()
  title: string;

  @Column({ type: 'text' })
  describe: string;

  @Column({ type: 'image'})
  image: File;

  @ManyToOne(() => User, (user) => user.posts)
  owner: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'int', default: 0 })
  likes: number; 
}