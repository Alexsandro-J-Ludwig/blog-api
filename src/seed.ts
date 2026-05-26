import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity.js';
import { Post } from './post/post.entity.js';
import bcrypt from 'bcrypt';

async function run() {
  // Use NestJS application context to leverage AppModule TypeORM configuration
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  const userRepository = dataSource.getRepository(User);
  const postRepository = dataSource.getRepository(Post);

  console.log('--- Database Seeding Started ---');

  // Clear existing posts and users to start clean
  console.log('Cleaning database...');
  await postRepository.createQueryBuilder().delete().execute();
  await userRepository.createQueryBuilder().delete().execute();

  // Generate 10 users
  console.log('Generating 10 users...');
  const users: User[] = [];
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for (let i = 1; i <= 10; i++) {
    const user = userRepository.create({
      username: `user_${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=user_${i}`
    });
    users.push(await userRepository.save(user));
  }
  console.log(`Created ${users.length} users.`);

  // Generate 50 posts distributed among those users
  console.log('Generating 50 posts...');
  const posts: Post[] = [];
  for (let i = 1; i <= 50; i++) {
    // Distribute posts evenly among the 10 users
    const owner = users[(i - 1) % users.length];
    const post = postRepository.create({
      title: `Interesting Tech Post ${i}`,
      describe: `This is the detailed content for post number ${i}. It describes some cool tech concepts and features.`,
      image: `https://picsum.photos/seed/post_${i}/800/600`,
      owner: owner,
      likes: Math.floor(Math.random() * 50),
      date: new Date(Date.now() - i * 3600000) // Spread posts chronologically
    });
    posts.push(await postRepository.save(post));
  }
  console.log(`Created ${posts.length} posts.`);

  await app.close();
  console.log('--- Database Seeding Completed Successfully ---');
}

run().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
