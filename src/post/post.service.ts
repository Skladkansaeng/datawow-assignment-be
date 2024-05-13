import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user) {
    const post = await this.postRepository.save({
      ...createPostDto,
      createdBy: user,
    });
    return this.findOne(post.id);
  }

  findAll() {
    return this.postRepository.find({
      relations: { createdBy: true, comments: true },
      order: {
        createdAt: 'DESC',
        comments: { createdAt: 'DESC' },
      },
    });
  }

  findByMe(user) {
    return this.postRepository.find({
      where: { createdBy: user },
      relations: { createdBy: true, comments: true },
      order: {
        createdAt: 'DESC',
        comments: { createdAt: 'DESC' },
      },
    });
  }

  findOne(id: number) {
    return this.postRepository.findOneOrFail({
      where: { id },
      relations: { comments: { createdBy: true }, createdBy: true },
      order: {
        comments: { createdAt: 'DESC' },
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepository.delete(id);
    return post;
  }
}
