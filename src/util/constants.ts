import { ColorCode } from "./Color";

export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  SILLY = "SILLY",
  INFO = "INFO",
  DEBUG = "DEBUG",
  TRACE = "TRACE",
}

export enum LogLevelValue {
  ERROR,
  WARN,
  SILLY,
  INFO,
  DEBUG,
  TRACE,
}

export enum ColorKey {
  LOG_LOGGER_NAME = 101,
  LOG_TIMESTAMP = 102,
  LOG_PROCESS_ID = 103,

  ERROR_CAUSED_BY = 200,
  ERROR_NAME = 201,
  ERROR_CODE = 202,
  ERROR_AT = 203,
  ERROR_TYPE_AND_FUNCTION = 204,
  ERROR_LOCATION = 205,

  ERROR_NODEJS_SOURCE_MAP_ARROW = 900,
  ERROR_NODEJS_SOURCE_MAP_LOCATION = 901,
}

export type PrettyFormatterColorKey = ColorKey | LogLevel;

export const PrettyFormatterColors = new Map<PrettyFormatterColorKey, ColorCode>()
  .set(LogLevel.WARN, ColorCode.YELLOW)
  .set(LogLevel.INFO, ColorCode.BLUE)
  .set(LogLevel.TRACE, ColorCode.MAGENTA)
  .set(LogLevel.DEBUG, ColorCode.CYAN)
  .set(LogLevel.SILLY, ColorCode.GREEN)
  .set(LogLevel.ERROR, ColorCode.RED)
  .set(ColorKey.LOG_LOGGER_NAME, ColorCode.BLUE)
  .set(ColorKey.LOG_TIMESTAMP, ColorCode.GRAY)
  .set(ColorKey.LOG_PROCESS_ID, ColorCode.BRIGHT_MAGENTA)
  .set(ColorKey.ERROR_CAUSED_BY, ColorCode.BG_RED)
  .set(ColorKey.ERROR_NAME, ColorCode.UNDERLINE)
  .set(ColorKey.ERROR_CODE, ColorCode.MAGENTA)
  .set(ColorKey.ERROR_AT, ColorCode.YELLOW)
  .set(ColorKey.ERROR_TYPE_AND_FUNCTION, ColorCode.CYAN)
  .set(ColorKey.ERROR_LOCATION, ColorCode.DIM)
  .set(ColorKey.ERROR_NODEJS_SOURCE_MAP_ARROW, ColorCode.GREEN)
  .set(ColorKey.ERROR_NODEJS_SOURCE_MAP_LOCATION, ColorCode.DIM);


