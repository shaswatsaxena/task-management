import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

/**
 * Main App Module
 * Sets up all other modules along with ConfigModule and TypeOrmModule
 * @export
 * @class AppModule
 */
@Module({
  imports: [
    // Loads environment variables
    ConfigModule.forRoot(),
    // Setup up TypeOrm connection to database asynchronously
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT'), 10) || 5432,
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: Boolean(configService.get<string>('DATABASE_SYNC')),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TasksModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
