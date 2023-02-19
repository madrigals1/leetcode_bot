import { ChatbotProvider } from '../../chatbots/models';
import { LanguageProblemCount, User } from '../../leetcode/models';
import { constants } from '../../utils/constants';

import { SmallMessages } from './small';

const { EMOJI, PROVIDERS, CML } = constants;

export class BigMessages {
  static welcomeText(prefix: string): string {
    return `Welcome! This is Leetcode Rating Bot Elite ${EMOJI.COOL} Boys

<b>Main commands:</b>
<b><i>${prefix}start</i></b> - Starting Page
<b><i>${prefix}help</i></b> - FAQ
<b><i>${prefix}rating</i></b> - Overall rating of Users
<b><i>${prefix}refresh</i></b> - Manual refresh of User Cache
<b><i>${prefix}profile</i></b> - Profiles of Users
<b><i>${prefix}submissions</i></b> - Submissions for Users
<b><i>${prefix}avatar</i></b> - Avatars for Users
<b><i>${prefix}problems</i></b> - Chart with Solved Problems for Users
<b><i>${prefix}langstats</i></b> - Amount of Solved Problems in each language for Users

<b>User related commands:</b>
<b><i>${prefix}add username1 username2</i></b> ... - adding Users
<b><i>${prefix}profile username</i></b> - Profile for separate User
<b><i>${prefix}avatar username</i></b> - Avatar for User
<b><i>${prefix}submissions username</i></b> - Get all recent submissions for User as Table
<b><i>${prefix}compare username1 username2</i></b> - Compare 2 Users' stats
<b><i>${prefix}problems username</i></b> - Chart with Solved Problems for specific User
<b><i>${prefix}langstats username</i></b> - Amount of Solved Problems in each language given User

<b>Admin commands (Only admin or local chat):</b>
<b><i>${prefix}remove username</i></b> - Remove User
<b><i>${prefix}clear</i></b> - Clear Database from all Users
<b><i>${prefix}stats</i></b> - Show Stats for this Bot
`;
  }

  static statsText(provider: ChatbotProvider, users: User[]): string {
    const userNameList = users.map(
      (user) => (`<b>- ${user.username}</b>`),
    ).join('\n');

    const providerKey = Object.keys(PROVIDERS)
      .find((key) => PROVIDERS[key].ID === provider);

    return `
<b>PROVIDER RELATED</b>
<b>Provider:</b> ${PROVIDERS[providerKey]?.NAME}
<b>Prefix:</b> ${PROVIDERS[providerKey]?.PREFIX}
<b>Discord enabled:</b> ${PROVIDERS.DISCORD.ENABLE}
<b>Telegram enabled:</b> ${PROVIDERS.TELEGRAM.ENABLE}
<b>Slack enabled:</b> ${PROVIDERS.SLACK.ENABLE}

<b>DATABASE RELATED</b>
<b>User Count:</b> ${users.length}

<b>USER LIST</b>
${userNameList}`;
  }

  static cmlHeader = `Cumulative Rating:
${EMOJI.GREEN_CIRCLE} Easy - <b>${CML.EASY_POINTS} points</b>
${EMOJI.YELLOW_CIRCLE} Medium - <b>${CML.MEDIUM_POINTS} points</b>
${EMOJI.RED_CIRCLE} Hard - <b>${CML.HARD_POINTS} points</b>

`;

  static ratingText(users: User[]): string {
    if (!users || users.length === 0) {
      return SmallMessages.noUsers;
    }
    return users.map(
      (user, index) => (`${index + 1}. <b>${user.username}</b> ${user.solved}`),
    ).join('\n');
  }

  static cmlRatingText(users: User[]): string {
    if (!users || users.length === 0) {
      return SmallMessages.noUsers;
    }

    const rating = this.cmlHeader;
    const cmlText = users.map(
      (user, index) => {
        const cmlForUser = user.computed.problemsSolved.cumulative;
        const cmlTextForUser = `<b>${user.username}</b> ${cmlForUser}`;
        return `${index + 1}. ${cmlTextForUser}`;
      },
    ).join('\n');

    return rating + cmlText;
  }

  static userText(user: User): string {
    const {
      easy, medium, hard, all, cumulative,
    } = user.computed.problemsSolved;

    return `<b>${user.name || 'No name'}</b> - <b>${user.link}</b>

Solved Problems:
${EMOJI.GREEN_CIRCLE} Easy - <b>${easy}</b>
${EMOJI.YELLOW_CIRCLE} Medium - <b>${medium}</b>
${EMOJI.RED_CIRCLE} Hard - <b>${hard}</b>
${EMOJI.BLUE_CIRCLE} All - <b>${all} / ${user.all}</b>
${EMOJI.BLUE_DIAMOND} Cumulative - <b>${cumulative}</b>`;
  }

  static languageStatsText(
    username: string,
    lpc: LanguageProblemCount[],
  ): string {
    // Sort by amount of solved problems
    const lpcSorted = lpc
      .sort((value1, value2) => value2.problemsSolved - value1.problemsSolved);

    const lpcText = lpcSorted
      .map(({ languageName, problemsSolved }) => {
        const name = `- <b>${languageName}</b>`;
        return `${name} ${problemsSolved}`;
      })
      .join('\n');
    const emoji = EMOJI.PROGRAMMER;
    const prefix = `${emoji} Problems solved by <b>${username}</b> in:\n`;

    return prefix + lpcText;
  }

  static contestRatingText(users: User[]): string {
    if (!users || users.length === 0) {
      return SmallMessages.noUsers;
    }

    const sortedContestRating = users
      .map((user) => ({
        username: user.username,
        rating: Math.round(user.contestData?.userContestRanking?.rating ?? 0),
      }))
      .sort((user1, user2) => user2.rating - user1.rating)
      .filter((user) => !!user.rating);

    return `${constants.EMOJI.CUP} Contest Rating \n\n${sortedContestRating.map(
      (user, index) => (`${index + 1}. <b>${user.username}</b> ${user.rating}`),
    ).join('\n')}`;
  }

  // static subscriptionsText(subscriptions: LBBSubscription[]): string {
  //   const allSubscriptionTypes = subscriptionTypeManager.getAll();
  //   const subscriptionTypesForSubscriptions = subscriptions
  //     .map((subscription: LBBSubscription) => subscription.type);

  //   return allSubscriptionTypes
  //     .map((fsub: FullSubscriptionTypeModel) => {
  //       const contains = (
  //         subscriptionTypesForSubscriptions.includes(fsub.subscriptionType)
  //       );

  //       return contains
  //         ? `${fsub.humanName} - ${EMOJI.SUCCESS}`
  //         : `${fsub.humanName} - ${EMOJI.CROSS_MARK}`;
  //     }).join('\n');
  // }
}
