import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DocumentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  fileSize: number;

  @Column({ nullable: true })
  filePath: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Column({ nullable: true })
  statusMessage: string;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ nullable: true })
  lastProcessedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
