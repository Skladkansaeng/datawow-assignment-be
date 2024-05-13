import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<Comment>;
  let postRepository: Repository<Post>;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateCommentDto: CreateCommentDto = {
    text: 'New test comment',
    postId: 1,
  };

  const mockComment: Comment = {
    id: 1,
    text: 'New test comment',
    post: mockPost,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      jest.spyOn(postRepository, 'findOneByOrFail').mockResolvedValue(mockPost);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(mockComment);

      const result = await service.create(mockCreateCommentDto);

      expect(postRepository.findOneByOrFail).toHaveBeenCalledWith({
        id: mockCreateCommentDto.postId,
      });
      expect(commentRepository.save).toHaveBeenCalledWith({
        ...mockCreateCommentDto,
        post: mockPost,
      });
      expect(result).toEqual(mockComment);
    });
  });
});
