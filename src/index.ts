import express, { Express, Request, Response } from "express";
import { _query } from "./database/read";
import "dotenv/config";
import campaignRoute from "./route/campaign.route";
import process from "process";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

app.use("/campaign", campaignRoute);

app.get("/", async (req: Request, res: Response) => {
  await _query(`select * from pc_cashup_campaign`, []);
  res.send("Typescript + Node.js + Express Server");
});

app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at <https://localhost>:${process.env.PORT}`,
  );
});
