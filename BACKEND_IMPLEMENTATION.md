# Implementación Backend - Cancelación de Citas

## 1. DTO (Data Transfer Object)

Crear archivo: `src/appointments/dto/cancel-appointment.dto.ts`

```typescript
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CancelAppointmentDto {
  @ApiPropertyOptional({
    description: 'Reason for cancellation',
    example: 'Schedule conflict',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cancellationReason?: string;
}
```

## 2. Actualizar Entidad Appointment

Agregar campos a la entidad: `src/appointments/entities/appointment.entity.ts`

```typescript
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ... otros campos existentes ...

  @Column({ type: 'enum', enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' })
  status: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 3. Servicio

Agregar método al servicio: `src/appointments/appointments.service.ts`

```typescript
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async cancelAppointment(
    appointmentId: string,
    userId: string,
    cancelDto: CancelAppointmentDto,
  ): Promise<Appointment> {
    // 1. Buscar la cita
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: appointmentId },
      relations: ['user', 'service', 'staff'], // Ajusta según tus relaciones
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
    }

    // 2. Verificar que el usuario es el dueño de la cita
    if (appointment.user.id !== userId) {
      throw new ForbiddenException('You can only cancel your own appointments');
    }

    // 3. Verificar que la cita no esté ya cancelada
    if (appointment.status === 'cancelled') {
      throw new BadRequestException('This appointment is already cancelled');
    }

    // 4. Verificar que la cita no esté completada
    if (appointment.status === 'completed') {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    // 5. Opcional: Verificar tiempo mínimo de cancelación (ej: 24 horas antes)
    const now = new Date();
    const appointmentStart = new Date(appointment.start);
    const hoursUntilAppointment = (appointmentStart.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilAppointment < 24) {
      // Puedes lanzar excepción o permitirlo con una nota
      // throw new BadRequestException('Appointments must be cancelled at least 24 hours in advance');
    }

    // 6. Actualizar la cita
    appointment.status = 'cancelled';
    appointment.cancellationReason = cancelDto.cancellationReason;
    appointment.cancelledAt = new Date();

    const cancelledAppointment = await this.appointmentsRepository.save(appointment);

    // 7. Opcional: Enviar notificación por email
    // await this.notificationsService.sendCancellationEmail(appointment);

    // 8. Opcional: Registrar en log/auditoría
    // await this.logsService.logAppointmentCancellation(appointment, userId);

    return cancelledAppointment;
  }

  // Método auxiliar para verificar si se puede cancelar
  async canCancelAppointment(appointmentId: string, userId: string): Promise<boolean> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id: appointmentId },
      relations: ['user'],
    });

    if (!appointment) return false;
    if (appointment.user.id !== userId) return false;
    if (appointment.status !== 'scheduled') return false;

    const now = new Date();
    const appointmentStart = new Date(appointment.start);
    const hoursUntilAppointment = (appointmentStart.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Permitir cancelación si es más de 24 horas antes
    return hoursUntilAppointment >= 24;
  }
}
```

## 4. Controlador

Agregar endpoint al controlador: `src/appointments/appointments.controller.ts`

```typescript
import { 
  Controller, 
  Patch, 
  Param, 
  Body, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiResponse({ 
    status: 200, 
    description: 'Appointment successfully cancelled',
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Appointment not found',
  })
  @ApiResponse({ 
    status: 403, 
    description: 'You can only cancel your own appointments',
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Appointment cannot be cancelled (already cancelled or completed)',
  })
  async cancelAppointment(
    @Param('id') id: string,
    @Body() cancelDto: CancelAppointmentDto,
    @Request() req,
  ) {
    const userId = req.user.id; // Asumiendo que el guard añade el usuario a la request
    const cancelledAppointment = await this.appointmentsService.cancelAppointment(
      id,
      userId,
      cancelDto,
    );

    return {
      message: 'Appointment cancelled successfully',
      appointment: cancelledAppointment,
    };
  }

  // Endpoint adicional para verificar si se puede cancelar
  @Get(':id/can-cancel')
  @ApiOperation({ summary: 'Check if appointment can be cancelled' })
  async canCancelAppointment(
    @Param('id') id: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    const canCancel = await this.appointmentsService.canCancelAppointment(id, userId);
    
    return {
      canCancel,
      message: canCancel 
        ? 'Appointment can be cancelled' 
        : 'Appointment cannot be cancelled',
    };
  }
}
```

## 5. Migración de Base de Datos (TypeORM)

Si usas migraciones, crear: `src/migrations/XXXXXX-add-cancellation-fields.ts`

```typescript
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCancellationFields1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna status si no existe
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['scheduled', 'cancelled', 'completed'],
        default: "'scheduled'",
      }),
    );

    // Agregar columna cancellationReason
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'cancellationReason',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );

    // Agregar columna cancelledAt
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'cancelledAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'status');
    await queryRunner.dropColumn('appointments', 'cancellationReason');
    await queryRunner.dropColumn('appointments', 'cancelledAt');
  }
}
```

## 6. Tests (Opcional pero recomendado)

Crear: `src/appointments/appointments.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('AppointmentsService - Cancel', () => {
  let service: AppointmentsService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should cancel appointment successfully', async () => {
    const appointmentId = 'test-id';
    const userId = 'user-id';
    const mockAppointment = {
      id: appointmentId,
      status: 'scheduled',
      user: { id: userId },
      start: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    };

    mockRepository.findOne.mockResolvedValue(mockAppointment);
    mockRepository.save.mockResolvedValue({ ...mockAppointment, status: 'cancelled' });

    const result = await service.cancelAppointment(
      appointmentId,
      userId,
      { cancellationReason: 'Test reason' },
    );

    expect(result.status).toBe('cancelled');
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if appointment not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(
      service.cancelAppointment('non-existent', 'user-id', {}),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not the owner', async () => {
    const mockAppointment = {
      id: 'test-id',
      status: 'scheduled',
      user: { id: 'other-user' },
    };

    mockRepository.findOne.mockResolvedValue(mockAppointment);

    await expect(
      service.cancelAppointment('test-id', 'user-id', {}),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw BadRequestException if already cancelled', async () => {
    const mockAppointment = {
      id: 'test-id',
      status: 'cancelled',
      user: { id: 'user-id' },
    };

    mockRepository.findOne.mockResolvedValue(mockAppointment);

    await expect(
      service.cancelAppointment('test-id', 'user-id', {}),
    ).rejects.toThrow(BadRequestException);
  });
});
```

## 7. Configuración adicional

### Variables de entorno (.env)

```env
# Configuración de cancelación
CANCELLATION_WINDOW_HOURS=24
SEND_CANCELLATION_EMAILS=true
```

### Notificaciones por email (opcional)

```typescript
// src/appointments/appointments.service.ts

async cancelAppointment(...) {
  // ... código de cancelación ...

  // Enviar emails
  if (process.env.SEND_CANCELLATION_EMAILS === 'true') {
    // Email al usuario
    await this.emailService.sendEmail({
      to: appointment.user.email,
      subject: 'Appointment Cancelled',
      template: 'appointment-cancelled',
      context: {
        userName: appointment.user.name,
        serviceName: appointment.service.name,
        appointmentDate: appointment.start,
        cancellationReason: cancelDto.cancellationReason,
      },
    });

    // Email al staff/admin
    await this.emailService.sendEmail({
      to: appointment.staff.email,
      subject: 'Appointment Cancellation Notice',
      template: 'appointment-cancelled-staff',
      context: {
        clientName: appointment.user.name,
        serviceName: appointment.service.name,
        appointmentDate: appointment.start,
        cancellationReason: cancelDto.cancellationReason,
      },
    });
  }

  return cancelledAppointment;
}
```

## Resumen de implementación

1. ✅ Crear DTO para validar datos de entrada
2. ✅ Actualizar entidad con campos de cancelación
3. ✅ Implementar lógica en el servicio con validaciones
4. ✅ Crear endpoint en el controlador
5. ✅ Ejecutar migración de base de datos
6. ✅ Opcional: Tests unitarios
7. ✅ Opcional: Notificaciones por email
8. ✅ Opcional: Logs/auditoría

## Consideraciones adicionales

- **Política de cancelación**: Ajusta el tiempo mínimo según tus necesidades
- **Reembolsos**: Si aplica, integra lógica de reembolsos
- **Disponibilidad**: Considera liberar el slot para otros usuarios
- **Analytics**: Registra razones de cancelación para análisis
- **Rate limiting**: Previene abuso con múltiples cancelaciones
