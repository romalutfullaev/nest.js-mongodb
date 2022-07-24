import {Inject, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from "./user.interface";
import * as argon2 from "argon2";
import {tokenExpireTime} from "../helper";

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await this.hashPass(createUserDto.password);
    return await this.userModel.create({
      ...createUserDto,
      password: hash,
    });
  }

  hashPass(pass: string) {
    return argon2.hash(pass);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findByToken(token: string): Promise<User> {
    return this.userModel.findOne({token});
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(
      id: string,
      updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  updateTokenDate(token: string) {
    return this.userModel.updateOne({token}, {tokenExpireDate: tokenExpireTime()});
  }
}