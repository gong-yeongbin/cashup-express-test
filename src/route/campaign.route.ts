import express from "express";
import * as campaignController from "../controller/campaign.controller";
import {
  cachedCampaignListMiddleware,
  duplicateMiddleware,
  validationMiddleware,
} from "../common/middleware/campaign.middleware";

const router = express.Router();

router.get(
  "/list",
  validationMiddleware,
  duplicateMiddleware,
  cachedCampaignListMiddleware,
  campaignController.list,
);

export default router;
