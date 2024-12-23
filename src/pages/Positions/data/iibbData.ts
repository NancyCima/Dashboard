import { IIBBData, PerceptionData } from '../types/iibbTypes';

export const mainData: IIBBData[] = [
  {
    concepto: 'CABA',
    import: 18304295.92,
    distrimar: -78032.84,
    junimar: -4976203.41,
    gondolaLed: -68965.31,
    warnesTelas: 0,
    aladmar: -3962055.50,
    aftermarket: -692006.90,
  },
  {
    concepto: 'BS AS',
    import: 6817491.36,
    distrimar: 169381.64,
    junimar: -1311961.89,
    gondolaLed: 15823.21,
    warnesTelas: 0,
    aladmar: -1008863.16,
    aftermarket: 291303.32,
  },
  {
    concepto: 'CORDOBA',
    import: 0,
    distrimar: 66964.28,
    junimar: 0,
    gondolaLed: 0,
    warnesTelas: 0,
    aladmar: 0,
    aftermarket: 0,
  },
  {
    concepto: 'SANTA FE',
    import: -810311.88,
    distrimar: 50499.83,
    junimar: 0,
    gondolaLed: 0,
    warnesTelas: 0,
    aladmar: 0,
    aftermarket: 0,
  },
  {
    concepto: 'MISIONES',
    import: 0,
    distrimar: 0,
    junimar: -1983041.11,
    gondolaLed: 0,
    warnesTelas: 0,
    aladmar: 0,
    aftermarket: 0,
  },
  {
    concepto: 'Saldo a pagar',
    import: 25121787.28,
    distrimar: 286845.75,
    junimar: 0.00,
    gondolaLed: 15823.21,
    warnesTelas: 964969.50,
    aladmar: 0.00,
    aftermarket: 291303.32,
  },
];

export const perceptionsData: PerceptionData[] = [
  {
    concepto: 'Total Percepciones ventas',
    import: 10776926.07,
    distrimar: 13447803.04,
    junimar: 1024682.51,
  },
  {
    concepto: 'Percepciones IIBB ARBA',
    import: 9558034.90,
    distrimar: 7650900.80,
    junimar: 1024682.51,
  },
  {
    concepto: 'Percepciones IIBB CABA',
    import: 26895307.58,
    distrimar: 5796902.24,
    junimar: 0,
  },
  {
    concepto: 'Percepciones IIBB MISIONES',
    import: 0,
    distrimar: 0,
    junimar: 518168.36,
  },
];

export const retentionsData: PerceptionData[] = [
  {
    concepto: 'Total Retenciones pagos',
    import: 1218891.17,
    distrimar: 1290208.84,
    junimar: 0,
  },
  {
    concepto: 'Retenciones IIBB CABA',
    import: 1218891.17,
    distrimar: 1290208.84,
    junimar: 0,
  },
  {
    concepto: 'Retenciones IIBB MISIONES',
    import: 0,
    distrimar: 0,
    junimar: 10203.35,
  },
];