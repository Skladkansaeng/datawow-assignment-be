import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { Comment } from '../src/comment/entities/comment.entity';
import { Post } from '../src/post/entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CommentController (e2e)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let commentRepository: Repository<Comment>;
  let postRepository: Repository<Post>;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockComment: Comment = {
    id: 1,
    text: 'This is a test comment',
    post: mockPost,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    commentRepository = moduleFixture.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    postRepository = moduleFixture.get<Repository<Post>>(
      getRepositoryToken(Post),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create a new comment', async () => {
    const createCommentDto = {
      text: 'This is a test comment',
      postId: 1,
    };

    jest.spyOn(postRepository, 'findOneByOrFail').mockResolvedValue(mockPost);
    jest.spyOn(commentRepository, 'save').mockResolvedValue(mockComment);

    const response = await request(app.getHttpServer())
      .post('/comment')
      .send(createCommentDto)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(Number),
      text: createCommentDto.text,
    });
  });

  // Add tests for other routes as needed
});
