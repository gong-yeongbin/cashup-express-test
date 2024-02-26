import dayjs from "dayjs";
import { CAMPAIGN_BANNER_IMAGES } from "../common/resource";
import HttpException from "../common/resource/httpException";
import * as campaignRepository from "../repository/campaign.repository";
import * as process from "process";
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL);

export const list = async (
  ifa: string,
  user_id: string,
  campaign_id: string,
) => {
  const start = dayjs();
  const campaign = await campaignRepository.list(ifa, user_id, campaign_id);

  const end = dayjs();
  console.log(end.diff(start, "millisecond"));
  if (!campaign || !campaign.length) {
    throw new HttpException("캠페인이 마감되었습니다.", 300);
  }

  const campaignList = createCampaignList(campaign, ifa, user_id, campaign_id);

  await redis.setex(user_id, 10, JSON.stringify(campaignList));

  return campaignList;
};

function createCampaignList(
  campaignEntity,
  ifa: string,
  user_id: string,
  campaign_id: string,
) {
  const range: number = campaignEntity.length > 10 ? 10 : campaignEntity.length;
  const indexArray = [];

  while (indexArray.length < range) {
    const randomNum = Math.trunc(Math.random() * campaignEntity.length);

    if (!indexArray.includes(randomNum)) {
      indexArray.push(randomNum);
    }
  }

  const campaignList = [];

  for (let i = 0; i < indexArray.length; i++) {
    campaignList.push({
      campaign_id: campaign_id,
      title: "스마트스토어 35초 둘러보기",
      description: "상품 35초 구경하고 퀴즈 풀면 적립!",
      unique_id: Number(campaignEntity[indexArray[i]].idx),
      icon_url:
        "https://clickup-buzz-1322421685.cos.ap-seoul.myqcloud.com/icon.png",
      list_img: CAMPAIGN_BANNER_IMAGES[Math.floor(Math.random() * 9)],
      landing_url: `http://${process.env.DOMAIN}/campaign/detail?idx=${Number(campaignEntity[indexArray[i]].idx)}&sub_idx=${campaignEntity[indexArray[i]].sub_idx}&user_id=${encodeURI(user_id)}&ifa=${ifa}`,
    });
  }

  return campaignList;
}
