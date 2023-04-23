import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forFeature(() => ({
      JWT_SECRET: process.env.JWT_SECRET,
    })),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
