import { PositionsState, PositionsActionType } from './types';
import { mainData as initialIvaMainData, deductionsData as initialIvaDeductionsData } from '@/pages/Positions/data/ivaData';
import { mainData as initialIibbMainData, perceptionsData as initialIibbPerceptionsData, retentionsData as initialIibbRetentionsData } from '@/pages/Positions/data/iibbData';

const initialState: PositionsState = {
  iva: {
    mainData: initialIvaMainData,
    deductionsData: initialIvaDeductionsData
  },
  iibb: {
    mainData: initialIibbMainData,
    perceptionsData: initialIibbPerceptionsData,
    retentionsData: initialIibbRetentionsData
  }
};

export const positionsReducer = (
  state: PositionsState = initialState,
  action: PositionsActionType
): PositionsState => {
  switch (action.type) {
    case 'SET_IVA_DATA':
      return {
        ...state,
        iva: {
          mainData: action.payload.mainData,
          deductionsData: action.payload.deductionsData
        }
      };

    case 'RESET_IVA_DATA':
      return {
        ...state,
        iva: initialState.iva
      };

    case 'SET_IIBB_DATA':
      return {
        ...state,
        iibb: {
          mainData: action.payload.mainData,
          perceptionsData: action.payload.perceptionsData,
          retentionsData: action.payload.retentionsData
        }
      };

    case 'RESET_IIBB_DATA':
      return {
        ...state,
        iibb: initialState.iibb
      };

    default:
      return state;
  }
};