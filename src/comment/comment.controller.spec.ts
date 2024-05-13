import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  const mockComment = {
    id: 1,
    text: 'This is a test comment',
    postId: 1,
  };

  const mockCreateCommentDto: CreateCommentDto = {
    text: 'New test comment',
    postId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockComment),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const result = await controller.create(mockCreateCommentDto);
      expect(service.create).toHaveBeenCalledWith(mockCreateCommentDto);
      expect(result).toEqual(mockComment);
    });
  });
});
