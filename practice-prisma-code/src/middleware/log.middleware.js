import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), //콘솔 출력
  ],
});

export default function (req, res, next) {
  const start = new Date().getTime();

  // 응답이 완료되면 로그를 기록, next() 이후 실행
  res.on("finish", () => {
    const duration = new Date().getTime() - start;
    logger.info(
      `Method: ${req.method}, URL: ${req.url}, Status: ${res.statusCode}, Duration: ${duration}ms`,
    );
  });

  next();
}
