import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: '' })
  repository_url: string;

  @Column({ default: '' })
  url: string;

  @Column({ default: 1 })
  weight: number;
}
