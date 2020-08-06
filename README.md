# @melike2d/logger

> A custom logger for my personal projects (based off [@ayanaware/logger](https://npmjs.com/@ayanaware/logger)

## Usage

```ts
import { Logger, ConsoleTransport, PrettyFormatter, LogLevel, config } from "@melike2d/logger";

const logger = new Logger("main");
logger.info("very cool")
logger.debug(config({ timestamp: false }), "Something Happened");
```

## License

This project is licensed under the **MIT License**. Read [this](/LICENSE) for more information.

---

[MeLike2D](https://melike2d.me/) &copy; 2020
