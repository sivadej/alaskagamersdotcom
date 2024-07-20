export interface ParticipantQueryRaw {
  id: string;
  data: ParticipantQueryRes;
}

export interface ParticipantQueryRes {
  data: {
    participant: STARTGG_Participant | null;
  };
  extensions: any;
}

export interface STARTGG_Participant {
  __typename: 'Participant';
  id?: number | null;
  gamerTag?: string | null;
  user?: STARTGG_User | null;
  entrants?: STARTGG_Entrant[] | null;
}

export interface STARTGG_User {
  __typename: 'User';
  name?: string | null;
  location?: STARTGG_Address | null;
}

export interface STARTGG_Address {
  __typename: 'Address';
  city?: string | null;
  state?: string | null;
}

export interface STARTGG_Entrant {
  __typename: 'Entrant';
  entrantId?: number | null;
  seeds?: STARTGG_Seed[] | null;
  event?: STARTGG_Event | null;
  standing?: STARTGG_Standing | null;
  paginatedSets?: STARTGG_SetConnection | null;
}

export interface STARTGG_Seed {
  __typename: 'Seed';
  id?: number | null;
  entrant?: STARTGG_Entrant | null;
  phase?: STARTGG_Phase | null;
  phaseGroup?: STARTGG_PhaseGroup | null;
  progressionSeedId?: number | null;
}

export interface STARTGG_Phase {
  __typename: 'Phase';
  name?: string | null;
}

export interface STARTGG_PhaseGroup {
  __typename: 'PhaseGroup';
  id?: number | null;
  bracketUrl?: string | null;
  displayIdentifier?: string | null;
  startAt?: number | null;
  phase?: STARTGG_Phase | null;
}

export interface STARTGG_Event {
  __typename: 'Event';
  name?: string | null;
}

export interface STARTGG_Standing {
  __typename: 'Standing';
  placement?: number | null;
}

export interface STARTGG_SetConnection {
  __typename: 'SetConnection';
  nodes?: STARTGG_Set[] | null;
}

export interface STARTGG_Set {
  __typename: 'Set';
  displayScore?: string | null;
  winnerId?: number | null;
  fullRoundText?: string | null;
  startAt?: number | null;
  phaseGroup?: STARTGG_PhaseGroup | null;
}
