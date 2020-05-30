import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import uploadConfig from '@configs/uploadConfig';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  avatar: string;

  @Column('varchar')
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) return null;

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/uploads/${this.avatar}`;
      case 's3':
        return `https://${uploadConfig.config.s3.Bucket}.s3.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
