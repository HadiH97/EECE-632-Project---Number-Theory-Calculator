export type TabType = 'prime' | 'totient' | 'miller' | 'fastexp' | 'crt';

export interface TabProps {
  id: TabType;
  name: string;
  icon: React.FC<{ className?: string }>;
}