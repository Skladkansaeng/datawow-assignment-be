import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostService', () => {
  let service: PostService;
  let postRepository: Repository<Post>;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
    createdAt: new Date(),
    updatedAt: new Date(),
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
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      jest.spyOn(postRepository, 'save').mockResolvedValue(mockPost);
      jest.spyOn(postRepository, 'findOneOrFail').mockResolvedValue(mockPost);
      const result = await service.create(mockCreatePostDto);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const mockPosts = [mockPost];
      jest.spyOn(postRepository, 'find').mockResolvedValue(mockPosts);
      const result = await service.findAll();
      expect(result).toEqual(mockPosts);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      jest.spyOn(postRepository, 'findOneOrFail').mockResolvedValue(mockPost);
      const result = await service.findOne(1);
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatedPost = { ...mockPost, ...mockUpdatePostDto };
      jest.spyOn(postRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedPost);
      const result = await service.update(1, mockUpdatePostDto);
      expect(result).toEqual(updatedPost);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPost);
      jest.spyOn(postRepository, 'delete').mockResolvedValue(undefined);
      const result = await service.remove(1);
      expect(result).toEqual(mockPost);
    });
  });
});
