# @dimensional-fun/logger

> A custom logger for my personal projects (based off [@ayanaware/logger](https://npmjs.com/@ayanaware/logger)

## Usage

```ts
import { Logger, config } from "@dimensional-fun/logger";

const logger = new Logger("main");
logger.info("very cool")
logger.debug(config({ timestamp: false }), "Something Happened");
```

---

This project is licensed under the **MIT License**. Read [this](/LICENSE) for more information.

[melike2d](https://dimesional.fun/) &copy; 2018 - 2021
