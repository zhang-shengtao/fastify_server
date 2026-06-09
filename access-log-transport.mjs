import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import build from "pino-abstract-transport";

function formatLogDate(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function transport(options = {}) {
  const logDir = path.resolve(process.cwd(), options.logDir ?? "logs");
  await mkdir(logDir, { recursive: true });

  let currentDate = "";
  let currentStream = null;

  function getStream(dateText) {
    if (currentStream && currentDate === dateText) {
      return currentStream;
    }

    if (currentStream) {
      currentStream.end();
    }

    currentDate = dateText;
    currentStream = createWriteStream(path.join(logDir, `${dateText}.log`), {
      flags: "a",
      encoding: "utf8",
    });

    return currentStream;
  }

  return build(async function (source) {
    for await (const obj of source) {
      const time = obj.time ? new Date(obj.time) : new Date();
      const stream = getStream(formatLogDate(time));
      stream.write(`${JSON.stringify(obj)}\n`);
    }
  });
}
