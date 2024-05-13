import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post]),
    UserModule,
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
