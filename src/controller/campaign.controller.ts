import * as campaignService from "../service/campaign.service";
import { NextFunction, Request, Response } from "express";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const { ifa, user_id, campaign_id } = req.query;

  const campaignList = await campaignService.list(
    ifa as string,
    user_id as string,
    campaign_id as string,
  );
  res.status(200).json({
    result_code: 200,
    result_message: "",
    campaign_list: campaignList,
  });
};

// const campaignController = {
//   list: async (req: Request, res: Response, next: NextFunction) => {
//     const { ifa, user_id, campaign_id } = req.query;
//
//     const campaignList = await list(
//       ifa as string,
//       user_id as string,
//       campaign_id as string,
//     );
//     res.status(200).json({
//       result_code: 200,
//       result_message: "",
//       campaign_list: campaignList,
//     });
//   },
// };
//
// export default campaignController;
