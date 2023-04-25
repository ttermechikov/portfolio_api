import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from '../project/project.entity';

@Entity('technologies')
export class TechnologyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: 1 })
  weight: number;

  @ManyToMany(() => ProjectEntity, (project) => project.technologies, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  projects: ProjectEntity[];
}
