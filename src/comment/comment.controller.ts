import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/user/auth.guard';

@Controller('comment')
@ApiTags('comment')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @AuthUser() user) {
    return this.commentService.create(createCommentDto, user);
  }
}
