import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTechnologiesAndProjectsRelation1682351690931
  implements MigrationInterface
{
  name = 'CreateTechnologiesAndProjectsRelation1682351690931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "technologies" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "weight" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects_technologies_technologies" ("projectsId" integer NOT NULL, "technologiesId" integer NOT NULL, CONSTRAINT "PK_77d95d8b7c4c6875e8edba2a937" PRIMARY KEY ("projectsId", "technologiesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_673d02c381e5ca853bb1fd0113" ON "projects_technologies_technologies" ("projectsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a6ec65771cb490a29fea3917f0" ON "projects_technologies_technologies" ("technologiesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_technologies_technologies" ADD CONSTRAINT "FK_673d02c381e5ca853bb1fd01133" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_technologies_technologies" ADD CONSTRAINT "FK_a6ec65771cb490a29fea3917f0b" FOREIGN KEY ("technologiesId") REFERENCES "technologies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projects_technologies_technologies" DROP CONSTRAINT "FK_a6ec65771cb490a29fea3917f0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects_technologies_technologies" DROP CONSTRAINT "FK_673d02c381e5ca853bb1fd01133"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a6ec65771cb490a29fea3917f0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_673d02c381e5ca853bb1fd0113"`,
    );
    await queryRunner.query(`DROP TABLE "projects_technologies_technologies"`);
    await queryRunner.query(`DROP TABLE "technologies"`);
  }
}
