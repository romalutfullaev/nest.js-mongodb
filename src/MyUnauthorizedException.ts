import {UnauthorizedException} from "@nestjs/common";

export default new UnauthorizedException({
    message: "Unauthorized"
})