import { IVAData } from '@/pages/Positions/types';
import { IIBBData, PerceptionData } from '@/pages/Positions/types/iibbTypes';

export interface IvaState {
  mainData: IVAData[];
  deductionsData: IVAData[];
}

export interface IibbState {
  mainData: IIBBData[];
  perceptionsData: PerceptionData[];
  retentionsData: PerceptionData[];
}

export interface PositionsState {
  iva: IvaState;
  iibb: IibbState;
}

export type PositionsActionType =
  | { type: 'SET_IVA_DATA'; payload: { mainData: IVAData[]; deductionsData: IVAData[] } }
  | { type: 'RESET_IVA_DATA' }
  | { type: 'SET_IIBB_DATA'; payload: { mainData: IIBBData[]; perceptionsData: PerceptionData[]; retentionsData: PerceptionData[] } }
  | { type: 'RESET_IIBB_DATA' };