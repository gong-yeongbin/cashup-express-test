import { _query } from "../database/read";
import dayjs from "dayjs";

export const list = async (
  ifa: string,
  user_id: string,
  campaign_id: string,
) => {
  const CAMPAIGN_ID_LIST = [
    "2037652",
    "2037829",
    "2039654",
    "2037826",
    "2037827",
    "2037651",
    "2039655",
    "2037828",
  ];
  try {
    const limitNum = (dayjs().get("date") + 1) / 24;
    const rewardDate = dayjs().format("YYYY-MM-DD HH");

    const randNum = Math.floor(Math.random() * 100);
    const idxKey = `${randNum < 10 ? "0" : ""}${randNum}`;

    let query = `select *
                    from pc_cashup_campaign
                    where idx not in (select campaign_idx from pc_cashup_campaign_history where ifa = ? and is_reward = 1 and left(reward_save_date,10) > left(date_sub(now(), interval 30 day),10))
                    and idx not in (select campaign_idx from pc_cashup_campaign_history where user_id = ? and is_reward = 1 and left(reward_save_date,10) > left(date_sub(now(), interval 30 day),10))
                    and (reward_limit * ?) > reward_cnt
                    and start_date = date_format(curdate(), '%Y-%m-%d')
                    and is_confirm = 1
                    and rand_id = ?
                    and (crawal_status = 1 or crawal_status = 3)
                    and (select count(*) from pc_cashup_campaign_history where left(reward_save_date,13) = ? and is_reward = 1 and (ifa = ? or user_id = ? )) < 20
                    and (select count(*) from pc_cashup_campaign_history where (ifa = ? or user_id = ?) and is_reward = 1 and left(reward_save_date,10) = left(now(), 10)) < 80`;

    if (CAMPAIGN_ID_LIST.includes(campaign_id)) {
      query += ` and account_idx = 32`;
    }

    const param = [
      ifa,
      user_id,
      limitNum,
      idxKey,
      rewardDate,
      ifa,
      user_id,
      ifa,
      user_id,
    ];

    const data = await _query(query, param);

    return data;
  } catch (e) {
    console.log(e);
  }
};
