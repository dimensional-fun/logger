export enum ColorCode {
  RESET = 0,

  BOLD,
  DIM,
  ITALIC,
  UNDERLINE,
  INVERSE = 7,
  HIDDEN,
  STRIKETHROUGH,

  BLACK = 30,
  RED,
  GREEN,
  YELLOW,
  BLUE,
  MAGENTA,
  CYAN,
  WHITE,
  GRAY = 90,

  BRIGHT_RED,
  BRIGHT_GREEN,
  BRIGHT_YELLOW,
  BRIGHT_BLUE,
  BRIGHT_MAGENTA,
  BRIGHT_CYAN,
  BRIGHT_WHITE,

  BG_BLACK = 40,
  BG_RED,
  BG_GREEN,
  BG_YELLOW,
  BG_BLUE,
  BG_MAGENTA,
  BG_CYAN,
  BG_WHITE,

  BG_BRIGHT_RED = 101,
  BG_BRIGHT_GREEN,
  BG_BRIGHT_YELLOW,
  BG_BRIGHT_BLUE,
  BG_BRIGHT_MAGENTA,
  BG_BRIGHT_CYAN,
  BG_BRIGHT_WHITE,

}

export class Color {
  public static formatters: Map<Color, ColorFormatter> = new Map();

  /**
   * Get the delimiter of a color code.
   * @param color The color code.
   * @since 1.0.0
   */
  static getDelimiter(color: ColorCode): number {
    switch (color) {
      case ColorCode.RESET:
        return 0;
      case ColorCode.BOLD:
      case ColorCode.DIM:
        return 22;
      case ColorCode.ITALIC:
        return 23;
      case ColorCode.UNDERLINE:
        return 24;
      case ColorCode.INVERSE:
        return 27;
      case ColorCode.HIDDEN:
        return 28;
      case ColorCode.STRIKETHROUGH:
        return 29;
      case ColorCode.BLACK:
      case ColorCode.RED:
      case ColorCode.GREEN:
      case ColorCode.YELLOW:
      case ColorCode.BLUE:
      case ColorCode.MAGENTA:
      case ColorCode.CYAN:
      case ColorCode.WHITE:
      case ColorCode.GRAY:
      case ColorCode.BRIGHT_RED:
      case ColorCode.BRIGHT_GREEN:
      case ColorCode.BRIGHT_YELLOW:
      case ColorCode.BRIGHT_BLUE:
      case ColorCode.BRIGHT_MAGENTA:
      case ColorCode.BRIGHT_CYAN:
      case ColorCode.BRIGHT_WHITE:
        return 39;
      case ColorCode.BG_BLACK:
      case ColorCode.BG_RED:
      case ColorCode.BG_GREEN:
      case ColorCode.BG_YELLOW:
      case ColorCode.BG_BLUE:
      case ColorCode.BG_MAGENTA:
      case ColorCode.BG_CYAN:
      case ColorCode.BG_WHITE:
      case ColorCode.BG_BRIGHT_RED:
      case ColorCode.BG_BRIGHT_GREEN:
      case ColorCode.BG_BRIGHT_YELLOW:
      case ColorCode.BG_BRIGHT_BLUE:
      case ColorCode.BG_BRIGHT_MAGENTA:
      case ColorCode.BG_BRIGHT_CYAN:
      case ColorCode.BG_BRIGHT_WHITE:
        return 49;
      default:
        throw new Error(`Cannot determine delimiter for color: ${color}`);

    }
  }

  /**
   * Create a color map.
   * @param map
   * @param defaults
   */
  public static createFormatters<T>(map: Map<T, Color | ColorFormatter>, defaults?: Map<T, Color | ColorFormatter>): Map<T, ColorFormatter> {
    const formatterMap: Map<T, ColorFormatter> = new Map();

    if (defaults != null) Color.mergeMaps(formatterMap, defaults);
    Color.mergeMaps(formatterMap, map);

    return formatterMap;
  }


  /**
   * Get a color formatter.
   * @param color The color to get.
   */
  public static get(color: ColorCode): ColorFormatter {
    const existing = Color.formatters.get(color);
    if (existing) return existing;

    const prefix = `\u001b[${color}m`;
    const suffix = `\u001b[${Color.getDelimiter(color)}m`;
    const formatter = (s: string) => s ? `${prefix}${s}${suffix}` : "";

    this.formatters.set(color, formatter);
    return formatter;
  }

  /**
   * Merge Color Maps.
   * @param to
   * @param from
   */
  private static mergeMaps<T>(to: Map<T, ColorFormatter>, from: Map<T, Color | ColorFormatter>) {
    for (const e of from.entries()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      to.set(e[0], typeof e[1] === "function" ? e[1] : Color.get(e[1]));
    }
  }

}

export type ColorFormatter = (msg: string) => string;
