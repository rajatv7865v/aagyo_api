import { Module } from "@nestjs/common";
import { AdminController } from "./controller/admin.controller";
import { AdminService } from "./service/admin.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../constants/auth.constant";
import { MerchantController } from "./controller/merchant.controller";
import { MerchantService } from "./service/merchant.service";
import { S3Module } from "../s3/s3.module";
import { JWT_CONFIG } from "src/config/jwt.config";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>("JWT.SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT.EXPIRE_TIME"),
        },
      }),
    }),
    S3Module,
  ],
  controllers: [AdminController, MerchantController],
  providers: [AdminService, MerchantService],
})
export class AuthModule {}
