import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthUserDto, CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async auth(authUserDto: AuthUserDto) {
    try {
      const user = await this.userRepository.findOneByOrFail({
        username: authUserDto.username,
      });

      const token = this.jwtService.sign(JSON.stringify(user));
      return { token };
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
