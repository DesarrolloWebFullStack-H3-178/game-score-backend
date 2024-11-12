import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { hash, compare } from 'bcryptjs';

// Create User

export interface User {
    userId: string;
    name: string;
    username: string;
    email: string;
    password: string;
    roles: string[];
    avatar: string;
    isActive: boolean;
}

// User login 

export interface LoginResponse {
    user: User;
    JWT: string;
}

export interface Paginator {
  data: [];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SessionResponse {
  message: string;
  data: {
    userId: string;
    userName: string;
    sessionToken: string;
    expiresAt: string;
  };
}

@Injectable()
export class UsersService {
    private users: User[] = [];

    constructor() {
        this.generateMockData();
    }

    private generateMockData(): void {
        for (let i = 0; i < 30; i++) {
            this.users.push({
              userId: uuidv4(),
              name: faker.internet.userName(),
              username: faker.internet.userName(),
              email: faker.internet.email(),
              password: hash('123456', 10),
              roles: [faker.helpers.arrayElement(['Player', 'Admin'])],
              avatar: faker.image.avatar(),
              isActive: faker.helpers.arrayElement([true, false])
            });
        }
    }

    // ========== User  ==========

    createUser(createUserDto: CreateUserDto): User {
      const newUser = {userId: faker.string.uuid(), ...createUserDto};
      this.users.push(newUser);
      return newUser;
    }

    loginUser(loginUserDto: LoginUserDto): LoginResponse  {
      const { email, password } = loginUserDto;
      const user = this.users.find(user => user.email === email);

      if (!user || user.password !== password) {
              throw new UnauthorizedException('Email or Password is invalid');
      }
      const JWT = faker.string.uuid();
      return {user, JWT};
    }

    getUserById(id: string): User {
      return this.users.find(user => user.userId === id);
    }

    getAllUsers(paginationQuery: PaginationQueryDto): Paginator {
        const { limit = 10, page = 1 } = paginationQuery;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = this.users.slice(start, end);
        const total = this.users.length;
        const totalPages = Math.ceil(total / limit);
    
        return <Paginator>{
          data,
          total,
          page,
          limit,
          totalPages,
        }
    }

    validateUser(email:string, password:string) {
      const user  = this.users.find(user => user.email === email);

      if( user && compare(password, user.password)){
        return user;
      }

      return 'No hay user';
    }

    getProfileUserById(id: string): User {
      return this.users.find(user => user.userId === id);
    }

    getSessionUserById(id: string): SessionResponse  {
      const user = this.users.find(user => user.userId === id);
      if (user) {
        const sessionToken = uuidv4();
        const expiresAt = faker.date.future().toISOString();
  
        return {
          message: 'session logged in successfully',
          data: {
            userId: user.userId,
            userName: user.username,
            sessionToken,
            expiresAt,
          },
        };
      }
      throw new UnauthorizedException('User session not found');
    }
    updateUser(id: string, updateUserDto: UpdateUserDto): User {
      const userIndex = this.users.findIndex(user => user.userId === id);
      if (userIndex === -1) {
        return null;
      }
  
      this.users[userIndex] = {...this.users[userIndex], ...updateUserDto};
      return this.users[userIndex];
    }

    // ========== Admin Users ==========  

    adminUpdateUser(id: string, updateUserDto: UpdateUserDto): User {
      const userIndex = this.users.findIndex(user => user.userId === id);
      if (userIndex === -1) {
        return null;
      }
  
      this.users[userIndex] = {...this.users[userIndex], ...updateUserDto};
      return this.users[userIndex];
    }

    userStatus(id: string): User {
      const userIndex = this.users.findIndex(user => user.userId === id);
      if (userIndex === -1) {
          return null;
      }
      this.users[userIndex].isActive = !this.users[userIndex].isActive;
      return this.users[userIndex];
    }

    getAdminUserById(id: string): User {
      return this.users.find(user => user.userId === id);
    }
}
