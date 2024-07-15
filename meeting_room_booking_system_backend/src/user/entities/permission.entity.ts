import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// ENtity 表
@Entity({
  name: 'permissions',
})

// 表字段
export class Permission {
  // 创建自动生成的列
  @PrimaryGeneratedColumn()
  id: number;

  // 创建列
  @Column({
    length: 20,
    comment: '权限代码',
  })
  code: string;

  // 创建列
  @Column({
    length: 20,
    comment: '权限描述',
  })
  description: string;
}
