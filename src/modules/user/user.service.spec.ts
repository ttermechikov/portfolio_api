import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

describe('UserService', () => {
  let userService: UserService;
  let configService: ConfigService;
  let userRepository: Repository<UserEntity>;

  // fake data
  const fakeUserDto = {
    email: 'johndoe@mail.com',
    password: 'secret42',
  };
  const fakeCreateUserDto: CreateUserDto = {
    username: 'johndoe',
    ...fakeUserDto,
  };
  const fakeLoginDto: LoginDto = {
    ...fakeUserDto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(configService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw an HttpException if a username or email has already been taken', () => {
      userRepository.findOne = jest.fn().mockResolvedValue(() => ({
        ...fakeCreateUserDto,
      }));

      return userService
        .createUser(fakeCreateUserDto)
        .catch((err: HttpException) => {
          expect(err.name).toMatch(/HttpException/i);
          expect(err.getResponse()).toMatchInlineSnapshot(`
            {
              "errors": {
                "email": "has already been taken",
                "username": "has already been taken",
              },
            }
          `);
          expect(userRepository.findOne).toHaveBeenCalledTimes(2); // for a username and email
        });
    });

    it('should save a new user if valid values are provided', () => {
      userRepository.findOne = jest.fn(() => null);

      return userService.createUser(fakeCreateUserDto).then(() => {
        expect(userRepository.save).toHaveBeenCalledWith(fakeCreateUserDto);
        expect(userRepository.save).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('login', () => {
    it('should throw an HttpException if user is not found in the database', () => {
      userRepository.findOne = jest.fn(() => null);
      bcrypt.compare = jest.fn();

      return userService.login(fakeLoginDto).catch((err: HttpException) => {
        expect(err instanceof HttpException).toBeTruthy();
        expect(err.name).toMatch(/HttpException/i);
        expect(err.getResponse()).toMatchInlineSnapshot(`
          {
            "errors": {
              "email or password": "is invalid",
            },
          }
        `);
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      });
    });

    it('should throw an HttpException if password is not valid', () => {
      const wrongPassword = 'SOME_RANDOM_PASSWORD';
      const loginDto = {
        ...fakeLoginDto,
        password: wrongPassword,
      };
      const foundUserDto = {
        ...fakeLoginDto,
        username: 'JohnDoe',
        id: 42,
      };
      userRepository.findOne = jest.fn().mockResolvedValueOnce(foundUserDto);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);

      return userService.login(loginDto).catch((err: HttpException) => {
        expect(err instanceof HttpException).toBeTruthy();
        expect(err.name).toMatch(/HttpException/i);
        expect(err.getResponse()).toMatchInlineSnapshot(`
          {
            "errors": {
              "email or password": "is invalid",
            },
          }
        `);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledWith(
          loginDto.password,
          foundUserDto.password,
        );
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('should return a user after successful login', () => {
    const loginDto = {
      ...fakeLoginDto,
    };
    const foundUserDto = {
      ...fakeLoginDto,
      username: 'JohnDoe',
      id: 42,
    };
    userRepository.findOne = jest
      .fn()
      .mockResolvedValueOnce({ ...foundUserDto });
    bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

    return userService.login(loginDto).then((user: UserEntity) => {
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        foundUserDto.password,
      );
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(user.email).toBe(foundUserDto.email);
      expect(user.username).toBe(foundUserDto.username);
      expect(user.id).toEqual(expect.any(Number));
    });
  });
});
