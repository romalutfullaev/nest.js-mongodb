import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { DatabaseModule } from "../database/database.module";
import { MongooseModule } from '@nestjs/mongoose';
import { userProviders } from "./user.providers";
import {User} from "./entities/user.entity";
import {UserSchema} from "../schemas/user.schema";

@Module({
  imports: [
      DatabaseModule,
      // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [
      UsersService,
      ...userProviders
  ],
  exports: [UsersService]
})
export class UserModule {}
