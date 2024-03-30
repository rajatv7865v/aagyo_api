import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { UnauthorizedException } from "src/exception/unauthorized.exception";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers["authorization"];
      const accessToken = authHeader && authHeader.split(" ")[1];
      if (!accessToken) {
        throw new UnauthorizedException("Unauthorization Access");
      }
      request.user = this.jwtService.verify(accessToken);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
    return true;
  }
}
