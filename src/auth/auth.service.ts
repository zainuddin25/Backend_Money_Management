import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common/exceptions'
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt"


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        private userService: UsersService,
        private jwtService: JwtService,
    ){}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findUsername(username);
        if (user && user.password === pass) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }

    async login(request: LoginDto) {
        try {
            const existUser = await this.userRepository.findOne({
                where: {
                    username: request.username
                }
            })
            if(!existUser) {
                throw new BadRequestException('Username Not Found')  
            }
            if (!await bcrypt.compare(request.password, existUser.password)) {
                throw new BadRequestException('Password Wrong')
            }
            const payload = await this.jwtService.signAsync({
                sub: existUser.id,
                username: existUser.username,
                email: existUser.email,
                join_at: existUser.createdAt,
                status: existUser.version
            })
            return payload
        } catch (error) {
            throw error
        }
    }

}
