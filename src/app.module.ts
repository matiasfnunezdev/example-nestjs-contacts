import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from './_core/firestore/firestore.module';
import { ContactController } from './controllers/contact/contact.controller';
import { ContactService } from './services/contact/contact.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    ContactController,
  ],
  providers: [
    AppService,
    ContactService,
  ],
})
export class AppModule {
}
