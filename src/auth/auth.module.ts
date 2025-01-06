import { Module } from "@nestjs/common";
import { AuthoController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    controllers:[AuthoController],
    providers:[AuthService]
})
export class AuthoModule{}
