import { Injectable, BadRequestException, UnauthorizedException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Authenticate, UserDocument } from './Schemas/authenticate.schema';
import { LoginDTO, RegisterDTO, SaveFcmTokenDto } from './dto/authenticate.dto';


@Injectable()
export class AuthenticateService {
  constructor(@InjectModel(Authenticate.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}


  async register(registerDto: RegisterDTO) {
    const { name, email, password, role} = registerDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ name, email, password: hashedPassword, role: role || 'user' });
    
    const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role, name: user.name, });

    return { message: 'User registered successfully', userId: user._id, access_token: token};
  }


  async login(loginDto: LoginDTO) {
    const { email, password} = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role, name: user.name });
    return { access_token: token };
  }


  async getUserInfo(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }


  async getAllUsersForAdmin(requesterId: string) {
    const admin = await this.userModel.findById(requesterId);
  
    if (!admin) throw new NotFoundException('Admin not found');
    if (admin.role !== 'admin') {
      throw new UnauthorizedException('Only admins can view all users');
    }
    const users = await this.userModel.find().select('name role');
    return users;
  }


  async saveFcmToken(userId: string, fcmToken: string | null) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
  
    if (user.role !== 'user') {
      return { success: false, message: 'FCM tokens can only be saved for users' };
    }
    user.fcmToken = fcmToken;
    await user.save();
    return {
      success: true,
      userId: user._id,
      email: user.email,
      fcmToken: user.fcmToken,
    };
  }
  
}
