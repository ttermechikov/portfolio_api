import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  // fake data
  const fakeCreateUserDto: CreateUserDto = {
    username: 'johndoe',
    email: 'johndoe@mail.com',
    password: 'secret42',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: createMock<UserService>() },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it(`should create a user by using the service's createUser method`, async () => {
      const fakeDto: CreateUserDto = { ...fakeCreateUserDto };

      await userController.createUser(fakeDto);

      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledWith(fakeDto);

      expect(userService.buildUserResponse).toHaveBeenCalledTimes(1);
      expect(userService.buildUserResponse).toHaveBeenCalledWith(fakeDto);
    });
  });

  describe('login', () => {
    it(`should login a user by using the service's login method`, async () => {
      const fakeDto: LoginDto = {
        email: fakeCreateUserDto.email,
        password: fakeCreateUserDto.password,
      };

      await userController.login(fakeDto);

      expect(userService.login).toHaveBeenCalledTimes(1);
      expect(userService.login).toHaveBeenCalledWith(fakeDto);

      expect(userService.buildUserResponse).toHaveBeenCalledTimes(1);
      expect(userService.buildUserResponse).toHaveBeenCalledWith(fakeDto);
    });
  });
});
