export interface HWLiveProps {
  id: number;
  isLive: boolean;
  targetDate: Date;
  [name: string]: any;
}

export interface YDLiveProps {
  url: string;
  isLive: boolean;
  startTime: Date;
  [name: string]: any;
}

