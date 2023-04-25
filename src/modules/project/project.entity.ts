import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TechnologyEntity } from '../technology/technology.entity';

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

  @ManyToMany(() => TechnologyEntity, (technology) => technology.projects)
  @JoinTable()
  technologies: TechnologyEntity[];
}
