import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: 'string',
    description: 'New password for the user',
    minLength: 8,
    example: 'testpasschanged123',
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated name of the user',
    example: 'Anand Jha',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    enum: Role,
    description: 'Updated user role',
    example: Role.EDITOR,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
