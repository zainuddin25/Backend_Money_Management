import { Controller, UseGuards, Post, Request, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard'
import { Body } from '@nestjs/common/decorators/http/route-params.decorator'
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService    
    ) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const res = await this.authService.login(loginDto)
        return {
            accessToken: res,
            statusCode: HttpStatus.OK,
            message: 200,
            status: 'Login Success'
        }
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return {
            data: await this.userService.create(registerDto),
            statusCode: HttpStatus.CREATED,
            message: 'Register Success'
        }
    }
}
