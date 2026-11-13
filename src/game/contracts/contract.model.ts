import type { Euros } from '../economy/economy.constants';

/**
 * Target orbits, simplified to the three most common commercial destinations:
 * low Earth orbit, sun-synchronous orbit and geostationary transfer orbit.
 */
export type OrbitType = 'leo' | 'sso' | 'gto';

export type PayloadType = 'communication' | 'earthObservation' | 'weather' | 'science' | 'technologyDemo';

export interface Payload {
  type: PayloadType;
  /** Proper name of the satellite, e.g. "Kalypso-4". Not translated. */
  name: string;
  massKg: number;
  targetOrbit: OrbitType;
}

/** A contract a customer offers. The player can accept it until the offer expires. */
export interface ContractOffer {
  id: number;
  /** Name of the (fictional) customer. Not translated. */
  customer: string;
  payload: Payload;
  /** Total payment for a successful launch, including the advance payment. */
  payment: Euros;
  /** Last game day on which the payload may be launched. */
  deadlineDay: number;
  /** Last game day on which the offer can be accepted. */
  offerExpiresOnDay: number;
}

export type ContractStatus = 'inProgress' | 'completed' | 'failed' | 'missedDeadline';

/** A contract the player has accepted. */
export interface Contract {
  id: number;
  customer: string;
  payload: Payload;
  payment: Euros;
  deadlineDay: number;
  acceptedOnDay: number;
  advancePayment: Euros;
  status: ContractStatus;
}
