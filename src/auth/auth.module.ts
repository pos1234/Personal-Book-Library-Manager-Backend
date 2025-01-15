import { Module } from "@nestjs/common";
import { AuthoController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[JwtModule.register({})],
    controllers:[AuthoController],
    providers:[AuthService]
})
export class AuthModule{}
