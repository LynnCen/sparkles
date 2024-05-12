export interface TimeRange {
  start: string;
  end: string;
  dateScope: number;
}
export interface DateProps {
  handleChangeTime: (start: string, end: string, dateScope: number, checkTab?: string) => void;
  checkDate: TimeRange;
  hasToday?: boolean;
  hasYesterday?:boolean;
  defaultTab?: string;
}
