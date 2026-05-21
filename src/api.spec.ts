import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module.js';

describe('Blog API Integration Tests', () => {
  let app: INestApplication;
  let jwtToken: string;
  let testUser = {
    username: `testuser_${Math.random().toString(36).substring(7)}`,
    email: `test_${Math.random().toString(36).substring(7)}@example.com`,
    password: 'password123',
  };
  let createdPostUuid: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }));
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('User Endpoints', () => {
    it('should register a new user (POST /users/create)', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User created successfully');
    });

    it('should not register user with existing username (POST /users/create)', async () => {
      await request(app.getHttpServer())
        .post('/users/create')
        .send({
          username: testUser.username,
          email: `another_${Math.random().toString(36).substring(7)}@example.com`,
          password: 'password123'
        })
        .expect(400);
    });

    it('should authenticate user and return JWT token (POST /users/login)', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User authenticated successfully');
      expect(response.body).toHaveProperty('token');
      jwtToken = response.body.token;
    });

    it('should update authenticated user fields (PUT /users/update)', async () => {
      const response = await request(app.getHttpServer())
        .put('/users/update')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          image: 'https://new-avatar-url.com/avatar.jpg'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User updated successfully');
      expect(response.body.updatedFields).toContain('image');
    });
  });

  describe('Post Endpoints', () => {
    it('should create a new post (POST /post/create)', async () => {
      const response = await request(app.getHttpServer())
        .post('/post/create')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: 'Testing NestJS Integration',
          describe: 'Writing integration tests with supertest and Jest.',
          image: 'https://picsum.photos/200'
        })
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Post created successfully');
    });

    it('should fetch posts of the logged-in user (GET /post/getByUser)', async () => {
      const response = await request(app.getHttpServer())
        .get('/post/getByUser')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      createdPostUuid = response.body[0].uuid;
      expect(response.body[0].title).toBe('Testing NestJS Integration');
    });

    it('should fetch all posts (GET /post/getAll)', async () => {
      const response = await request(app.getHttpServer())
        .get('/post/getAll')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should fetch posts by username (GET /post/postUser:username)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/post/postUser${testUser.username}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].owner.username).toBe(testUser.username);
    });

    it('should update a post (PUT /post/alterPost:uuidPost)', async () => {
      const response = await request(app.getHttpServer())
        .put(`/post/alterPost${createdPostUuid}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: 'Testing NestJS Integration (Updated)',
          describe: 'Writing integration tests with supertest and Jest (Updated).'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Fields updated with sucessful');
    });

    it('should like a post (POST /post/:postUuid/like)', async () => {
      const response = await request(app.getHttpServer())
        .post(`/post/${createdPostUuid}/like`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(201);

      expect(response.body.likes).toBe(1);
    });

    it('should unlike the post when liked again (POST /post/:postUuid/like)', async () => {
      const response = await request(app.getHttpServer())
        .post(`/post/${createdPostUuid}/like`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(201);

      expect(response.body.likes).toBe(0);
    });

    it('should delete a post (DELETE /post/:postUuid)', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/post/${createdPostUuid}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Post deleted with sucessful');
    });
  });

  describe('User Cleanup', () => {
    it('should delete the test user (DELETE /users/delete)', async () => {
      const response = await request(app.getHttpServer())
        .delete('/users/delete')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('menssage', 'User deleted with sucessful');
    });
  });
});
