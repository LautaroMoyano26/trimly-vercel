import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosController } from './servicios.controller';
import { ServicioService } from './servicios.service';

describe('ServiciosController', () => {
  let controller: ServiciosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiciosController],
      providers: [ServicioService],
    }).compile();

    controller = module.get<ServiciosController>(ServiciosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
