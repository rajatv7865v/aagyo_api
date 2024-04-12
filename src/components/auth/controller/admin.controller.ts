import { Body, Controller, Get, Post } from "@nestjs/common";
import { AdminService } from "../service/admin.service";
import { AdminLoginDTO } from "../dto/adminLogin.dto";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { AdminSignupDTO } from "../dto/admin-Signup.dto";

@ApiTags("admin")
@Controller("/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: "Login Admin" })
  @Post("/signIn")
  @ApiBody({ type: AdminLoginDTO })
  signInAccount(
    @Body() adminLoginDTO: AdminLoginDTO
  ): Promise<{ message: string }> {
    return this.adminService.signInAccount(adminLoginDTO);
  }

  @ApiOperation({ summary: "Signup Admin Account" })
  @Post("/signUp")
  @ApiBody({ type: AdminSignupDTO })
  signUpAccount(
    @Body() adminSignupDTO: AdminSignupDTO
  ): Promise<{ message: string }> {
    return this.adminService.signUpAccount(adminSignupDTO);
  }
}
