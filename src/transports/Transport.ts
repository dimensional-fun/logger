import { LogLevel } from "../util/constants";

import type { Logger } from "../Logger";
import type { Formatter, LogData } from "../formatters/Formatter";

export abstract class Transport<O extends TransportOptions> {
  /**
   * The log level.
   */
  public level: LogLevel;

  /**
   * The formatter to use when transporting logs/
   */
  public formatter: Formatter;

  /**
   * Whether or not this transport is enabled.
   */
  public enabled: boolean | (() => boolean | Promise<boolean>);

  /**
   * The options provided to this transport.
   */
  protected readonly options: O;

  /**
   * @param options
   */
  public constructor(options: O) {
    this.options = options;

    this.level = options.level ?? LogLevel.INFO;
    this.formatter = options.formatter;
    this.enabled = options.enabled ?? true;
  }

  /**
   * Print the message.
   * @param data
   * @param formatted
   */
  public abstract print(data: LogData, formatted: string): unknown;

  /**
   * @param origin
   * @param data
   */
  public async log(origin: Logger, data: LogData): Promise<boolean> {
    if (!this.enabled) return false;
    else if (typeof this.enabled === "function") {
      const v = await (this.enabled());
      if (!v) return false;
    }

    const formatted = await this.formatter.format(data, origin);
    this.print(data, formatted);

    return true;
  }
}

export interface TransportOptions {
  formatter: Formatter;
  level?: LogLevel;
  enabled?: boolean | (() => boolean | Promise<boolean>);
}
