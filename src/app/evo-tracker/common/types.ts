export interface PlayerResult {
  id: number | null;
  name: string | null;
  events: EventResult[];
  schedule: PoolSchedule[];
}

export interface PoolSchedule {
  poolId: string;
  game: string | null;
  startTimeRaw: number | null;
  startTimeLocal: string | null;
  startDayLocal: string | null;
  bracketUrl: string | null;
  station: string | null;
}

export interface EventResult {
  entrantId: number | null;
  game: string | null;
  standing: number | null;
  sets: SetResult[];
}

export interface SetResult {
  displayScore: string | null;
  fullRoundText: string | null;
  win: boolean | null;
  bracketUrl: string | null;
}

export interface SchedulesByBlock {
  startTimeRaw: number;
  startTimeUtc: string | null;
  scheduledPlayers: {
    name: string;
    game: string;
    poolId: string;
    station: string;
    url: string;
    participantId: number;
  }[];
}
