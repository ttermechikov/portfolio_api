import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjects1682267662269 implements MigrationInterface {
  name = 'CreateProjects1682267662269';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "repository_url" character varying NOT NULL DEFAULT '', "url" character varying NOT NULL DEFAULT '', "weight" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "projects"`);
  }
}
