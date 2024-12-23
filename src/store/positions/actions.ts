import { IVAData } from '@/pages/Positions/types';
import { IIBBData, PerceptionData } from '@/pages/Positions/types/iibbTypes';
import { PositionsActionType } from './types';

export const setIvaData = (mainData: IVAData[], deductionsData: IVAData[]): PositionsActionType => ({
  type: 'SET_IVA_DATA',
  payload: { mainData, deductionsData }
});

export const resetIvaData = (): PositionsActionType => ({
  type: 'RESET_IVA_DATA'
});

export const setIibbData = (
  mainData: IIBBData[],
  perceptionsData: PerceptionData[],
  retentionsData: PerceptionData[]
): PositionsActionType => ({
  type: 'SET_IIBB_DATA',
  payload: { mainData, perceptionsData, retentionsData }
});

export const resetIibbData = (): PositionsActionType => ({
  type: 'RESET_IIBB_DATA'
});