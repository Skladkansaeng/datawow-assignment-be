import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/entities/post.entity';
import { Comment } from './comment/entities/comment.entity';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
@Module({
  imports: [
    PostModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'datawow-assignment',
      // autoLoadEntities: true,
      entities: [Post, Comment, User],
      synchronize: true,
    }),
    CommentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
