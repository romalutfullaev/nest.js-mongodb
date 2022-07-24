import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from 'src/user/dto/create-user.dto';
import {UsersService} from 'src/user/user.service';
import * as argon2 from 'argon2';
import {AuthDto} from './dto/auth.dto';
import {tokenExpireTime} from "../helper";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) {}
    async signUp(createUserDto: CreateUserDto): Promise<any> {
        // Проверка пользователя
        const userExists = await this.usersService.findByUsername(
            createUserDto.username,
        );
        if (userExists) {
            throw new BadRequestException('Пользователь уже существует');
        }

        const token = await this.getToken();
        await this.usersService.create({
            ...createUserDto,
            token: token,
            tokenExpireDate: tokenExpireTime()
        })
        return {token};
    }

    async signIn(authDto: AuthDto) {
        // Check if user exists
        const user = await this.usersService.findByUsername(authDto.username);
        if (!user) throw new BadRequestException('Пользователь не существует');
        const passwordMatches = await argon2.verify(user.password, authDto.password);
        if (!passwordMatches)
            throw new BadRequestException('Неправельнйы пароль');
        const token = await this.getToken()
        this.setToken(user._id, token)
        return {token};
    }

    async logout(userId: string) {
        return this.setToken(userId)
    }

    getToken() {
        return argon2.hash(Date.now().toString())
    }

    setToken(userId, token = null) {
        const tokenExpireDate = tokenExpireTime()
        this.usersService.update(userId, { token, tokenExpireDate });
    }
}