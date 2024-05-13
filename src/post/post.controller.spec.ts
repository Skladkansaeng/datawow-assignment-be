import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
  };

  const mockCreatePostDto: CreatePostDto = {
    title: 'New Test Post',
    content: 'This is a new test post.',
  };

  const mockUpdatePostDto: UpdatePostDto = {
    title: 'Updated Test Post',
    content: 'This is an updated test post.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPost),
            findAll: jest.fn().mockResolvedValue([mockPost]),
            findOne: jest.fn().mockResolvedValue(mockPost),
            update: jest.fn().mockResolvedValue(mockPost),
            remove: jest.fn().mockResolvedValue(mockPost),
          },
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const result = await controller.create(mockCreatePostDto);
      expect(service.create).toHaveBeenCalledWith(mockCreatePostDto);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockPost]);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const result = await controller.update('1', mockUpdatePostDto);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdatePostDto);
      expect(result).toEqual(mockPost);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPost);
    });
  });
});
