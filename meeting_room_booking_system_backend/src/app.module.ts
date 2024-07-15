import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Permission } from './user/entities/permission.entity';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33069,
      username: 'root',
      password: 'yang',
      database: 'meeting_room_booking_system',
      synchronize: true,
      logging: true,
      entities: [Permission, Role, User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
