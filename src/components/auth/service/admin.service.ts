import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AdminLoginDTO } from "../dto/adminLogin.dto";
import { CrudService } from "src/base/crud.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ADMIN_MODEL, AdminDocument } from "src/Schema/admin";
import { SIGNIN, USERNOTEXIST, WRONGPASSWORD } from "src/utils/messages";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { AdminSignupDTO } from "../dto/admin-Signup.dto";

@Injectable()
export class AdminService extends CrudService {
  constructor(
    @InjectModel(ADMIN_MODEL)
    private readonly adminModel: Model<AdminDocument>,
    private jwtService: JwtService
  ) {
    super(adminModel);
  }

  async signInAccount(adminLoginDTO: AdminLoginDTO) {
    try {
      const { email, password } = adminLoginDTO;
      const user = await this.adminModel.findOne({ email });
      if (!user) {
        throw new BadRequestException(USERNOTEXIST);
      }
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      const comparePassword = await bcrypt.compare(password, hashedPassword);
      if (!comparePassword) {
        throw new UnauthorizedException(WRONGPASSWORD);
      }
      const payload = {
        sub: user._id,
        userName: user.name,
        userEmail: user.email,
      };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        status: "ACCOUNT_LOGIN_SUCESSFULLY",
        access_token,
        message: SIGNIN,
      };
    } catch (err) {
      throw new ExceptionsHandler(err);
    }
  }

  async signUpAccount(adminSignupDTO: AdminSignupDTO): Promise<any> {
    try {
      const { email, name, password } = adminSignupDTO;
      const result = await this.adminModel.create();
      return {
        message: "Account Signup Successfully!",
        STATUS: "SUCCESS",
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }
}
