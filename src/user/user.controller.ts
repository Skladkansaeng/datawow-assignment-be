import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserDto, CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthGuard } from './auth.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('auth')
  auth(@Body() authUserDto: AuthUserDto) {
    return this.userService.auth(authUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getAuth(@AuthUser() user) {
    return user;
  }
}
