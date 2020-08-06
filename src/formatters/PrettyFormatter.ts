import { inspect } from "util";
import fecha from "fecha";
import { Color, ColorCode, ColorFormatter } from "../util/Color";
import { ColorKey, LogLevel, PrettyFormatterColorKey, PrettyFormatterColors } from "../util/constants";

import type { Formatter, LogData } from "./Formatter";
import type { Logger } from "../Logger";

const ERROR_STACK_LINE_COLOR_REGEX = /^ {4}at (?:(.*?) (\(.*\))|(.*?))$/gm;
const ERROR_HEADER_COLOR_REGEX = /^(?:(Caused by:) )?(\w+):* *(.*)$/gm;
const NODEJS_SOURCE_MAPPED_LINE_COLOR_REGEX = /^ {8}-> (.*?)$/gm;

export class PrettyFormatter implements Formatter {
  /**
   * Formatters to use.
   */
  public readonly colors: Map<PrettyFormatterColorKey, ColorFormatter>;

  /**
   * The format to use when formatting timestamps.
   */
  public dateFormat: string;

  /**
   * Creates a new pretty formatter.
   * @param options
   */
  public constructor(options: PrettyFormatterOptions = {}) {
    this.colors = Color.createFormatters(options.colors ?? new Map(), PrettyFormatterColors);
    this.dateFormat = options.dateFormat ?? "HH:mm:ss DD-MM-YYYY";
  }

  /**
   * Formats a message.
   * @param data
   * @param logger
   */
  public format(data: LogData, logger: Logger): string {
    let str = "";
    if (data.timestamp) str += `${this.formatTimestamp(data.timestamp)} `;
    str += this.formatLevel(data.level);
    str += `${this.formatPid()} `;
    str += `${this.formatLoggerName(logger.name)}: `;

    if (data.prefix) str += `${data.prefix} ｜`;
    str += this.formatMessage(data.input as unknown[]).trim();
    if (data.suffix) str += `｜ ${data.suffix}`;

    return str;
  }

  /**
   * Formats the timestamp of log.
   * @param timestamp
   */
  protected formatTimestamp(timestamp: number | Date | undefined): string {
    const formatted = fecha.format(new Date(timestamp ?? Date.now()), this.dateFormat);
    return this.colors.get(ColorKey.LOG_TIMESTAMP)?.(formatted) as string;
  }

  /**
   * Formats the level of a log.
   * @param level The log level.
   */
  protected formatLevel(level: LogLevel): string {
    return this.colors.get(level)?.(level.padEnd(6)) as string;
  }

  /**
   * Formats the process id..
   */
  protected formatPid(): string {
    return this.colors.get(ColorKey.LOG_PROCESS_ID)?.(process.pid.toString()) as string;
  }

  /**
   * Formats the logger name.
   * @param name The logger name.
   */
  protected formatLoggerName(name: string): string {
    let str = "";
    str += Color.get(ColorCode.GRAY)("(");
    str += this.colors.get(ColorKey.LOG_LOGGER_NAME)?.(name);
    str += Color.get(ColorCode.GRAY)(")");
    return str;
  }

  /**
   * Formats the log message.
   * @param input The log message to format.
   */
  protected formatMessage(input: unknown[]): string {
    let msg = "";
    for (const data of input) {
      if (data instanceof Error) {
        const formatted = this.formatError(data);
        if (msg.length > 0) msg += `${formatted}`;
        else msg += formatted;
      } else msg += `${data} `;
    }

    return msg;
  }

  /**
   * Formats an error.
   * @param error
   */
  protected formatError(error: Error): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyError: any = error;
    const stack: string = typeof anyError?.[inspect.custom] === "function" ? inspect(error, false, 0, false) : error.stack as string;

    return stack
      .replace(ERROR_STACK_LINE_COLOR_REGEX, (_, typeAndFn, location1, location2) => {
        return `    ${this.colors.get(ColorKey.ERROR_AT)?.("at")} ${this.colors.get(ColorKey.ERROR_TYPE_AND_FUNCTION)?.(typeAndFn)}${this.colors.get(ColorKey.ERROR_LOCATION)?.(location2)} ${this.colors.get(ColorKey.ERROR_LOCATION)?.(location1)}`;
      })
      .replace(NODEJS_SOURCE_MAPPED_LINE_COLOR_REGEX, (_, location) => {
        return `        ${this.colors.get(ColorKey.ERROR_NODEJS_SOURCE_MAP_ARROW)?.("->")} ${this.colors.get(ColorKey.ERROR_NODEJS_SOURCE_MAP_LOCATION)?.(location)}`;
      })
      .replace(ERROR_HEADER_COLOR_REGEX, (_, causedBy, errorName, message) => {
        let code = "";
        if (message.startsWith("(")) {
          const lastIndex: number = message.indexOf(")");
          code = message.substr(1, lastIndex - 1);
          message = message.substr(lastIndex + 1);
        }

        return `${this.colors.get(ColorKey.ERROR_CAUSED_BY)?.(causedBy)}${causedBy ? " " : ""}${this.colors.get(ColorKey.ERROR_NAME)?.(errorName)}: ${code ? "(" : ""}${this.colors.get(ColorKey.ERROR_CODE)?.(code)}${code ? ")" : ""}${message}`;
      });

  }
}

export interface PrettyFormatterOptions {
  colors?: Map<string, ColorCode>;
  dateFormat?: string;
}
