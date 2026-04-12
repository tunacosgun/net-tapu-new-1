import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Payment } from '../entities/payment.entity';

@Controller('admin/finance/summary')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminFinanceSummaryController {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  @Get()
  async getSummary() {
    const result = await this.paymentRepo
      .createQueryBuilder('p')
      .select([
        'COALESCE(SUM(CASE WHEN p.status IN (\'completed\', \'provisioned\') THEN p.amount ELSE 0 END), 0) AS total_captured_amount',
        'COALESCE(SUM(CASE WHEN p.status IN (\'refunded\', \'partially_refunded\') THEN p.amount ELSE 0 END), 0) AS total_refunded_amount',
        'COUNT(CASE WHEN p.auction_id IS NOT NULL AND p.status = \'completed\' THEN 1 END) AS total_settled_auctions',
        'COUNT(CASE WHEN p.status = \'failed\' THEN 1 END) AS total_failed_settlements',
      ])
      .getRawOne();

    return {
      total_captured_amount: result?.total_captured_amount ?? '0',
      total_refunded_amount: result?.total_refunded_amount ?? '0',
      total_settled_auctions: Number(result?.total_settled_auctions ?? 0),
      total_failed_settlements: Number(result?.total_failed_settlements ?? 0),
    };
  }
}
