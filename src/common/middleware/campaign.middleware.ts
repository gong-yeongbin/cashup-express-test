import { NextFunction, Request, Response } from "express";
import HttpException from "../resource/httpException";
import process from "process";
import Redis from "ioredis";
import { CAMPAIGN_BANNER_IMAGES } from "../resource";

export const redis = new Redis(process.env.REDIS_URL);

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { campaign_id, ifa, user_id, secret_key } = req.query;

  if (campaign_id == null || campaign_id == "" || campaign_id == " ") {
    res.status(200).json({
      result_code: 400,
      result_message: "필수 파라미터가 누락되었습니다. (campaign_id)",
    });
  } else if (secret_key == null || secret_key == "" || secret_key == " ") {
    res.status(200).json({
      result_code: 400,
      result_message: "필수 파라미터가 누락되었습니다. (secret_key)",
    });
  } else if (secret_key !== process.env.SECRET_KEY) {
    res.status(200).json({
      result_code: 401,
      result_message: "secret_key가 일치하지 않습니다.",
    });
  } else if (ifa == null || ifa == "" || ifa == " ") {
    res.status(200).json({
      result_code: 400,
      result_message: "필수 파라미터가 누락되었습니다. (ifa)",
    });
  } else if (user_id == null || user_id == "" || user_id == " ") {
    res.status(200).json({
      result_code: 400,
      result_message: "필수 파라미터가 누락되었습니다. (user_id)",
    });
  } else {
    next();
  }
};

export const duplicateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { campaign_id, ifa, user_id } = req.query;

  const key: string = `${campaign_id}${ifa}${user_id}`;
  const value = await redis.get(key);

  if (value) {
    res.status(200).json({
      result_code: 300,
      result_message: "캠페인이 마감되었습니다.",
    });
  } else {
    await redis.setex(key, 5, "1");

    next();
  }
};

export const cachedCampaignListMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user_id } = req.query;

  const getCachedData = await redis.get(user_id as string);

  if (getCachedData) {
    const campaignList = JSON.parse(getCachedData);

    campaignList.forEach((campaign) => {
      campaign["list_img"] =
        CAMPAIGN_BANNER_IMAGES[Math.floor(Math.random() * 9)];
    });

    res.status(200).json({
      result_code: 200,
      result_message: "",
      campaign_list: campaignList,
    });
  } else {
    next();
  }
};
