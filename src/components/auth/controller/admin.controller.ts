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

@ApiTags("admin")
@Controller("/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post("/signIn")
  @ApiOperation({ summary: "Login Admin" })
  @ApiParam({
    name: "id",
    type: "integer",
    description: "enter unique value",
    required: true,
  })
  @ApiQuery({
    name: "id",
    type: "integer",
    description: "enter unique value",
    required: true,
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 5,
          description: "this is unique",
        },
      },
    },
  })
  signInAccount(
    @Body() adminLoginDTO: AdminLoginDTO
  ): Promise<{ message: string }> {
    return this.adminService.signInAccount(adminLoginDTO);
  }
}
