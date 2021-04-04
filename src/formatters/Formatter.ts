import type { LogLevel } from "../util/constants";
import type { LogConfigData, Logger } from "../Logger";

export interface Formatter {
  /**
   * Formats a message.
   * @param data Data from the logger.
   * @param logger The logger the message came from.
   * @since 1.0.0
   */
  format(data: LogData, logger: Logger): string | Promise<string>;
}

export interface LogData extends LogConfigData {
  level: LogLevel;
}
