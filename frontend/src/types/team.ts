export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  formation?: string;
  coach?: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position;
  photo?: string;
  teamId: string;
}

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Lineup {
  teamId: string;
  formation: string;
  startingXI: Player[];
  substitutes: Player[];
  coach: string;
}