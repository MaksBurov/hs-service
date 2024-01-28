import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
// import { Observable } from 'rxjs';
// import { UserI } from '../models/user.interface';
import { CreateUserDto } from '../dto/createUser.dto';
import { UserResponseInterface } from '../models/userResponse.interface';
import { LoginUserDto } from '../dto/login.dto';
import { User } from '../decorators/user.decorator';
import { UserEntity } from '../user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateUserDto } from '../dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post()
  // add(@Body() user: UserI): Observable<UserI> {
  //   return this.userService.add(user);
  // }

  // @Get()
  // findAll(): Observable<UserI[]> {
  //   return this.userService.findAll();
  // }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: UserEntity,
    @User('id') currentUserId: number,
  ): Promise<UserResponseInterface> {
    console.log('userId', currentUserId);
    return this.userService.buildUserResponse(user);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );

    return this.userService.buildUserResponse(user);
  }
}
