import * as schedule from 'node-schedule';

import ApiService from '../backend/apiService';
import Cache from '../backend/cache';
import { LBBSubscription } from '../backend/models';
import { SubscriptionType } from '../chatbots/models';
import Telegram from '../chatbots/telegram';

import { KontestContest } from './kontest/models';

async function notifyContests() {
  const contestsPromise: Promise<KontestContest[]> = (
    ApiService.fetchClosestContests()
  );
  const subscriptionsPromise: Promise<LBBSubscription[]> = (
    ApiService.fetchSubscriptions()
  );

  const [contests, subscriptions] = (
    await Promise.all([contestsPromise, subscriptionsPromise])
  );

  const contestSubcriptions = subscriptions
    .filter((subscription) => subscription.type === SubscriptionType.Contest);

  contestSubcriptions.forEach((subscription) => {
    const channelKey = Cache.getChannelKey(subscription.channel);
    contests.forEach((contest) => {
      const message = `${contest.name} at ${contest.start_time}`;
      Telegram.bot
        .sendMessage(channelKey.chat_id, message)
        .then(() => null);
      // Change notification status
    });
  });
}

export async function startScheduler(): Promise<void> {
  // Check for contests to notify every minute
  schedule.scheduleJob('* 5 * * * *', notifyContests);
}
