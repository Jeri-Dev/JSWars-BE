import { PartialType } from 'npm:@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto.ts';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
