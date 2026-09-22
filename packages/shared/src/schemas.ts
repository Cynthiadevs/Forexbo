import {
  SignalDirection,
  SignalStatus,
  SignalStrengthCategory,
  Timeframe,
  MarketTrend,
  VolatilityLevel,
  UserRole,
  SubscriptionTier,
  ContentType,
  DestinationType,
  SLTPMethod
} from './enums.ts';

export class Schema<T = any> {
  validator: (data: any) => T;

  constructor(validator: (data: any) => T) {
    this.validator = validator;
  }

  public parse(data: any): T {
    return this.validator(data);
  }

  public optional(): Schema<T | undefined> {
    return new Schema<T | undefined>((data) => {
      if (data === undefined || data === null) return undefined;
      return this.validator(data);
    });
  }

  public default(defaultValue: T): Schema<T> {
    return new Schema<T>((data) => {
      if (data === undefined || data === null) return defaultValue;
      return this.validator(data);
    });
  }
}

export const z = {
  string: () => {
    return new Schema<string>((data) => {
      if (typeof data !== 'string') throw new Error(`Expected string, received ${typeof data}`);
      return data;
    });
  },
  number: () => {
    return new Schema<number>((data) => {
      if (typeof data !== 'number' || isNaN(data)) throw new Error(`Expected number, received ${typeof data}`);
      return data;
    });
  },
  boolean: () => {
    return new Schema<boolean>((data) => {
      if (typeof data !== 'boolean') throw new Error(`Expected boolean, received ${typeof data}`);
      return data;
    });
  },
  date: () => {
    return new Schema<Date>((data) => {
      const d = new Date(data);
      if (isNaN(d.getTime())) throw new Error(`Expected valid date, received ${data}`);
      return d;
    });
  },
  enum: <U extends string>(values: readonly U[]) => {
    return new Schema<U>((data) => {
      if (!values.includes(data)) throw new Error(`Invalid enum value: ${data}`);
      return data;
    });
  },
  nativeEnum: <U extends string>(obj: Record<string, U>) => {
    const validValues = Object.values(obj);
    return new Schema<U>((data) => {
      if (!validValues.includes(data)) throw new Error(`Invalid enum value: ${data}`);
      return data;
    });
  },
  array: <U>(elementSchema: Schema<U>) => {
    return new Schema<U[]>((data) => {
      if (!Array.isArray(data)) throw new Error(`Expected array, received ${typeof data}`);
      return data.map(el => elementSchema.parse(el));
    });
  },
  object: <U extends Record<string, Schema<any>>>(shape: U) => {
    return new Schema<{ [K in keyof U]: ReturnType<U[K]['parse']> }>((data) => {
      if (typeof data !== 'object' || data === null) throw new Error(`Expected object, received ${typeof data}`);
      const result: any = {};
      for (const [key, schema] of Object.entries(shape)) {
        result[key] = schema.parse(data[key]);
      }
      return result;
    });
  }
};

export const CandleSchema = z.object({
  timestamp: z.number(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number()
});

export const MarketTickSchema = z.object({
  symbol: z.string(),
  bid: z.number(),
  ask: z.number(),
  spread: z.number(),
  timestamp: z.number()
});

export const AIStructuredExplanationSchema = z.object({
  summary: z.string(),
  marketBias: z.enum(['BULLISH', 'BEARISH', 'NEUTRAL'] as const),
  keyFactors: z.array(z.string()),
  riskFactors: z.array(z.string()),
  technicalConfluence: z.array(z.string()),
  caption: z.string(),
  disclaimer: z.string()
});

export const CreateSignalSchema = z.object({
  symbol: z.string(),
  timeframe: z.nativeEnum(Timeframe),
  direction: z.nativeEnum(SignalDirection),
  entryPrice: z.number(),
  stopLoss: z.number(),
  takeProfit1: z.number(),
  takeProfit2: z.number().optional(),
  takeProfit3: z.number().optional(),
  score: z.number(),
  scoreCategory: z.nativeEnum(SignalStrengthCategory),
  sltpMethod: z.nativeEnum(SLTPMethod).default(SLTPMethod.ATR_DYNAMIC),
  strategyName: z.string().default('Smart Money Multi-Confluence')
});

export const TelegramDestinationSchema = z.object({
  name: z.string(),
  chatId: z.string(),
  type: z.nativeEnum(DestinationType).default(DestinationType.CHANNEL),
  enabled: z.boolean().default(true),
  signalsEnabled: z.boolean().default(true),
  analysisEnabled: z.boolean().default(true),
  newsEnabled: z.boolean().default(true),
  dailyReportEnabled: z.boolean().default(true),
  resultUpdatesEnabled: z.boolean().default(true)
});

export const AuthLoginSchema = z.object({
  email: z.string(),
  password: z.string()
});

export const AuthRegisterSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
  role: z.nativeEnum(UserRole).default(UserRole.USER)
});

export const BacktestRequestSchema = z.object({
  symbol: z.string(),
  timeframe: z.nativeEnum(Timeframe),
  startDate: z.string(),
  endDate: z.string(),
  initialBalance: z.number().default(10000),
  riskPercentagePerTrade: z.number().default(1.0),
  minScoreToQualify: z.number().default(70)
});
