import { Injectable, UnauthorizedException, NotFoundException  } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
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
  role: string;
  avatar: string;
  isActive: boolean;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  username: string;
  role: string;
  avatar: string;
  isActive: boolean;
  createdAt: Date;
};

// User login 

export interface LoginResponse {
    user: User;
    JWT: string;
}

export interface Paginator<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SessionResponse {
  message: string;
  data: {
    userId: string;
    username: string;
    sessionToken: string;
    expiresAt: string;
  };
}

@Injectable()
export class UsersService {
    private users: User[] = [];

    constructor( private prisma: PrismaService ) {}

    // ========== User  ==========

    async createUser(createUserDto: CreateUserDto): Promise<User> {
      const { password, ...userData } = createUserDto; 
      const hashedPassword = await hash(password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword, 
        },
      });
  
      return {
        userId: newUser.userId,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        password: '******', 
        role: newUser.role,
        avatar: newUser.avatar,
        isActive: newUser.isActive,
      };
    }

    async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
      const { email, password } = loginUserDto;
    
      // Buscar el usuario en la base de datos usando Prisma
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          userId: true,
          email: true,
          password: true,
          name: true,
          username: true,
          role: true,
          avatar: true,
          isActive: true,
        },
      });
    
      if (!user || !(await compare(password, user.password))) {
        // Si no se encuentra el usuario o la contraseña es incorrecta
        throw new UnauthorizedException('Email or Password is invalid');
      }
    
      // Generar el JWT (en este caso, el UUID lo utilizamos como un token de ejemplo)
      const JWT = faker.string.uuid(); 
    
      return {
        user: {
          userId: user.userId,
          name: user.name,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
        },
        JWT,
      };
    }
    

    async getUserById(id: string): Promise<User | null> {
      const user = await this.prisma.user.findUnique({
        where: { userId: id },
        select: {
          userId: true,
          name: true,
          username: true,
          email: true,
          password: true,
          role: true,
          avatar: true,
          isActive: true,
        },
      });
    
      if (!user) {
        return null;
      }
    
      return {
        userId: user.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        password: '******',
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
      };
    }
    
    async getAllUsers(paginationQuery: PaginationQueryDto): Promise<Paginator<User>> {
      const { limit = 10, page = 1 } = paginationQuery;
      const skip = (page - 1) * limit;
      const total = await this.prisma.user.count();
      const totalPages = Math.ceil(total / limit);
    
      const limitNumber = Number(limit);
      const pageNumber = Number(page);
    
      const data = await this.prisma.user.findMany({
        skip: skip,
        take: limitNumber,
        select: {
          userId: true,
          email: true,
          name: true,
          username: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
      });
    
      const users: User[] = data.map(user => ({
        userId: user.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
      }));
    
      return {
        data: users,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
      };
    }
    
    validateUser(email:string, password:string) {
      const user  = this.users.find(user => user.email === email);

      if( user && compare(password, user.password)){
        return user;
      }

      return 'No User found';
    }

    async getProfileUserById(userId: string): Promise<UserProfile> {
      const user = await this.prisma.user.findUnique({
        where: { userId: userId },
        select: {
          email: true,
          userId: true,
          name: true,
          username: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
      });
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      return user;
    }

    async getSessionUserById(id: string): Promise<SessionResponse> {
      const user = await this.prisma.user.findUnique({
        where: { userId: id },
        select: {
          email: true,
          userId: true,
          name: true,
          username: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
      });
    
      if (user) {
        const sessionToken = uuidv4();
        const expiresAt = faker.date.future().toISOString();
    
        return {
          message: 'session logged in successfully',
          data: {
            userId: user.userId,
            username: user.username,
            sessionToken,
            expiresAt,
          },
        };
      }
      throw new UnauthorizedException('User session not found');
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
      try {
        const updatedUser = await this.prisma.user.update({
          where: { userId: id },
          data: updateUserDto,
          select: {
            userId: true,
            name: true,
            username: true,
            email: true,
            password: true,
            role: true,
            avatar: true,
            isActive: true,
          },
        });
    
        const user: User = {
          userId: updatedUser.userId,
          name: updatedUser.name,
          username: updatedUser.username,  
          email: updatedUser.email,
          password: updatedUser.password,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          isActive: updatedUser.isActive,
        };
    
        return user;
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
        throw error;
      }
    }

    // ========== Admin Users ==========  

    async adminUpdateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
      try {
        const updatedUser = await this.prisma.user.update({
          where: { userId: id },
          data: updateUserDto,
          select: {
            userId: true,
            name: true,
            username: true,
            email: true,
            password: true,
            role: true,
            avatar: true,
            isActive: true,
          },
        });
    
        const user: User = {
          userId: updatedUser.userId,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          password: updatedUser.password,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          isActive: updatedUser.isActive,
        };
        return user;
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
        throw error;
      }
    }

    async userStatus(id: string): Promise<User | null> {
      try {
        const updatedUser = await this.prisma.user.update({
          where: { userId: id },
          data: {
            isActive: {
              set: !(await this.prisma.user.findUnique({
                where: { userId: id },
                select: { isActive: true },
              })).isActive,
            },
          },
          select: {
            userId: true,
            name: true,
            username: true,
            email: true,
            password: true,
            role: true,
            avatar: true,
            isActive: true,
          },
        });
    
        const user: User = {
          userId: updatedUser.userId,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          password: updatedUser.password,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          isActive: updatedUser.isActive,
        };
    
        return user;
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
        throw error;
      }
    }

    async getAdminUserById(id: string): Promise<User | null> {
      try {
        const user = await this.prisma.user.findUnique({
          where: { userId: id },
          select: {
            userId: true,
            name: true,
            username: true,
            email: true,
            password: true,
            role: true,
            avatar: true,
            isActive: true,
          },
        });
    
        if (!user) {
          throw new NotFoundException('User not found');
        }
        const userData: User = {
          userId: user.userId,
          name: user.name,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
        };

        return userData;
      } catch (error) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
        throw error;
      }
    }
}
