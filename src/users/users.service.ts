import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async validateUsername(username: string) {
    return this.usersRepository.find({ 
      where: {
        username
      }
    })
  }

  async create(registerDto: RegisterDto) {
    const user = new User()

    const hashPassword = await bcrypt.hash(registerDto.password, 12)
    user.username = registerDto.username,
    user.password = hashPassword,
    user.email = registerDto.email

    return await this.usersRepository.save(user)
  }
















  // async create(createUserDto: CreateUserDto) {
  //   const result = await this.usersRepository.insert(createUserDto);

  //   return this.usersRepository.findOneOrFail({
  //     where: {
  //       id: result.identifiers[0].id,
  //     },
  //   });
  // }

  findAll() {
    return this.usersRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   try {
  //     await this.usersRepository.findOneOrFail({
  //       where: {
  //         id,
  //       },
  //     });
  //   } catch (e) {
  //     if (e instanceof EntityNotFoundError) {
  //       throw new HttpException(
  //         {
  //           statusCode: HttpStatus.NOT_FOUND,
  //           error: 'Data not found',
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     } else {
  //       throw e;
  //     }
  //   }

  //   await this.usersRepository.update(id, updateUserDto);

  //   return this.usersRepository.findOneOrFail({
  //     where: {
  //       id,
  //     },
  //   });
  // }

  async remove(id: string) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.delete(id);
  }
}
