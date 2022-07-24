import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {UsersService} from "./user/user.service";
import MyUnauthorizedException from "./MyUnauthorizedException";

@Injectable()
export class MyAuthGuard implements CanActivate {
    constructor(private userService: UsersService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const token = context.switchToHttp().getRequest().query.token;
        if (!token) {
            throw MyUnauthorizedException;
        }

        return this.userService.findByToken(token).then( async (user) => {
            if (user.tokenExpireDate < Date.now()) {
                throw MyUnauthorizedException;
            }
            await this.userService.updateTokenDate(token)
            return true
        })
    }
}
