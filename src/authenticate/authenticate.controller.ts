import { Controller, Post, Body, Get, UseGuards, Req, Put} from '@nestjs/common';
import { LoginDTO, RegisterDTO, SaveFcmTokenDto } from './dto/authenticate.dto';
import { AuthenticateService } from './authenticate.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('auth')
export class AuthenticateController {
  constructor(private readonly authService: AuthenticateService) {}

  @Post('register')
  register(@Body() registerDTO : RegisterDTO) {
    return this.authService.register(registerDTO);
  }
  
  @Post('login')
  login(@Body() loginDTO: LoginDTO,) {
    return this.authService.login(loginDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return this.authService.getUserInfo(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-users')
  async getAllUsers(@Req() req) {
    return this.authService.getAllUsersForAdmin(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save-fcm-token')
  async saveFcmToken(@Req() req, @Body() dto: SaveFcmTokenDto) {
    return this.authService.saveFcmToken(req.user.userId, dto.fcmToken);
  }
}
