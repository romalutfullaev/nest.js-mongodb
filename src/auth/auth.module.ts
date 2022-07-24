import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {ConfigService} from "@nestjs/config";

@Module({
  imports: [
      UserModule,
  ],
  providers: [AuthService, ConfigService],
  controllers: [AuthController]
})
export class AuthModule {}
