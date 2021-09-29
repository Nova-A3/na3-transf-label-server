import { json } from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { label } from "./classes";
import { isLabelConfig } from "./types";

dotenv.config();

const api = express();

api.use(cors());
api.use(helmet());
api.use(morgan("dev"));
api.use(json());

api.post("/print", async (req, res) => {
  const { body } = req;

  if (!isLabelConfig(body)) {
    return res.status(400).send("Invalid label config");
  }

  const copies =
    typeof body.copies === "number" && body.copies >= 1
      ? Math.floor(body.copies)
      : 1;

  const l = label(body);

  await l.print({ forceFill: true, copies });

  res.status(200).send("OK");
});

const listener = api.listen(3000, () => {
  const listenerAddress = listener.address();

  if (listenerAddress) {
    if (typeof listenerAddress === "string") {
      console.log(`Listening on address ${listenerAddress}`);
    } else {
      console.log(`Listening on port ${listenerAddress.port}`);
    }
  }
});
