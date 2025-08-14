import { z } from 'zod';

// 認証用のスキーマ
export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
});

export const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  confirmPassword: z.string(),
  display_name: z.string().min(1, '表示名を入力してください'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
});

// ユーザープロファイル用のスキーマ
export const profileSchema = z.object({
  display_name: z.string().min(1, '表示名を入力してください'),
  avatar_url: z.string().url().optional().or(z.literal('')),
});

// 育児記録用のスキーマ
export const recordSchema = z.object({
  type: z.enum(['milk', 'diaper', 'sleep', 'vaccination', 'growth']),
  timestamp: z.string().datetime(),
  metadata: z.record(z.any()).default({}),
});

// ミルク記録用のメタデータ
export const milkMetadataSchema = z.object({
  amount: z.number().min(0, '量は0以上で入力してください'),
  unit: z.enum(['ml', 'oz']).default('ml'),
  temperature: z.number().optional(),
  notes: z.string().optional(),
});

// おむつ記録用のメタデータ
export const diaperMetadataSchema = z.object({
  type: z.enum(['wet', 'dirty', 'both']),
  notes: z.string().optional(),
});

// 睡眠記録用のメタデータ
export const sleepMetadataSchema = z.object({
  duration: z.number().min(0, '時間は0以上で入力してください'), // 分単位
  quality: z.enum(['good', 'fair', 'poor']).optional(),
  notes: z.string().optional(),
});

// 予防接種記録用のメタデータ
export const vaccinationMetadataSchema = z.object({
  vaccine_name: z.string().min(1, 'ワクチン名を入力してください'),
  hospital: z.string().optional(),
  batch_number: z.string().optional(),
  next_date: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// 成長記録用のメタデータ
export const growthMetadataSchema = z.object({
  weight: z.number().min(0).optional(), // kg
  height: z.number().min(0).optional(), // cm
  head_circumference: z.number().min(0).optional(), // cm
  notes: z.string().optional(),
});

// パートナーシップ用のスキーマ
export const partnershipSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

// 型エクスポート
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type RecordInput = z.infer<typeof recordSchema>;
export type MilkMetadata = z.infer<typeof milkMetadataSchema>;
export type DiaperMetadata = z.infer<typeof diaperMetadataSchema>;
export type SleepMetadata = z.infer<typeof sleepMetadataSchema>;
export type VaccinationMetadata = z.infer<typeof vaccinationMetadataSchema>;
export type GrowthMetadata = z.infer<typeof growthMetadataSchema>;
export type PartnershipInput = z.infer<typeof partnershipSchema>;