import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeTechnologyNameUnique1682360726642
  implements MigrationInterface
{
  name = 'MakeTechnologyNameUnique1682360726642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technologies" ADD CONSTRAINT "UQ_46800813f460eb131823371caee" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technologies" DROP CONSTRAINT "UQ_46800813f460eb131823371caee"`,
    );
  }
}
