import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateParcelDto } from './create-parcel.dto';

export class UpdateParcelDto extends PartialType(CreateParcelDto) {
  @IsUUID()
  @IsOptional()
  assignedConsultant?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  show_listing_date?: boolean;

  @IsUUID()
  @IsOptional()
  assigned_consultant?: string;
}
