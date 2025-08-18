/**
 * Baby Log アイコンシステム
 * Lucide Reactを使用したアイコンコンポーネント
 */

import React from 'react';
import {
  // 記録タイプアイコン
  Baby,
  Droplets,
  Moon,
  Ruler,
  
  // UI操作アイコン
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  
  // ステータス・フィードバック
  Check,
  AlertCircle,
  Info,
  Heart,
  Star,
  
  // ナビゲーション
  Home,
  BarChart3,
  FileText,
  LogOut,
  
  // その他
  Camera,
  Download,
  Upload,
  Share,
  Copy,
  
  // 追加アイコン
  Droplet,
  
  type LucideIcon,
} from 'lucide-react';

// Baby Logで使用するアイコン名の型定義
export type IconName =
  // 記録タイプ
  | 'milk'
  | 'diaper' 
  | 'sleep'
  | 'growth'
  
  // UI操作
  | 'plus'
  | 'edit'
  | 'trash'
  | 'search'
  | 'filter'
  | 'calendar'
  | 'clock'
  | 'user'
  | 'settings'
  | 'menu'
  | 'close'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  
  // ステータス・フィードバック
  | 'check'
  | 'alert'
  | 'info'
  | 'heart'
  | 'star'
  
  // ナビゲーション
  | 'home'
  | 'stats'
  | 'records'
  | 'logout'
  
  // その他
  | 'camera'
  | 'download'
  | 'upload'
  | 'share'
  | 'copy'
  | 'droplet';

// アイコンマッピング
const iconMap: Record<IconName, LucideIcon> = {
  // 記録タイプ
  milk: Baby, // ミルクアイコンとしてBabyを使用（より適切なアイコンが見つからない場合）
  diaper: Droplets,
  sleep: Moon,
  growth: Ruler,
  
  // UI操作
  plus: Plus,
  edit: Edit,
  trash: Trash2,
  search: Search,
  filter: Filter,
  calendar: Calendar,
  clock: Clock,
  user: User,
  settings: Settings,
  menu: Menu,
  close: X,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  
  // ステータス・フィードバック
  check: Check,
  alert: AlertCircle,
  info: Info,
  heart: Heart,
  star: Star,
  
  // ナビゲーション
  home: Home,
  stats: BarChart3,
  records: FileText,
  logout: LogOut,
  
  // その他
  camera: Camera,
  download: Download,
  upload: Upload,
  share: Share,
  copy: Copy,
  droplet: Droplet,
};

// カラーバリエーション
export type IconColor = 
  | 'current'
  | 'primary'
  | 'secondary' 
  | 'accent'
  | 'milk'
  | 'diaper'
  | 'sleep'
  | 'growth'
  | 'success'
  | 'warning'
  | 'error'
  | 'muted';

// サイズバリエーション
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  'aria-label'?: string;
}

const sizeMap: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const colorMap: Record<IconColor, string> = {
  current: 'text-current',
  primary: 'text-primary-500',
  secondary: 'text-secondary-500',
  accent: 'text-accent-500',
  milk: 'text-milk',
  diaper: 'text-diaper',
  sleep: 'text-sleep',
  growth: 'text-growth',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  muted: 'text-gray-400',
};

export function Icon({ 
  name, 
  size = 'md', 
  color = 'current', 
  className = '',
  'aria-label': ariaLabel,
  ...props 
}: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const sizeClass = sizeMap[size];
  const colorClass = colorMap[color];
  const combinedClassName = `${sizeClass} ${colorClass} ${className}`.trim();

  return (
    <IconComponent
      className={combinedClassName}
      aria-label={ariaLabel || name}
      {...props}
    />
  );
}

// 記録タイプ別のアイコン取得ヘルパー
export function getRecordTypeIcon(recordType: 'milk' | 'diaper' | 'sleep' | 'growth'): IconName {
  return recordType;
}

// 記録タイプ別のカラー取得ヘルパー
export function getRecordTypeColor(recordType: 'milk' | 'diaper' | 'sleep' | 'growth'): IconColor {
  return recordType;
}

export default Icon;