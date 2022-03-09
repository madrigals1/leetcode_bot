import { ChatbotProvider } from '../../chatbots';
import ProtoDatabase from '../../database/database.proto';

test('database.proto class', async () => {
  const database = new ProtoDatabase();
  const errorMessage = 'Not Implemented';

  const fakeUsername = 'fake_username';
  const fakeChannelData = {
    id: 1,
    key: {
      chatId: '1231231',
      provider: ChatbotProvider.Discord,
    },
    userLimit: 10,
  };

  await expect(database.connect())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.findAllUsers())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.userExists(fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.addUser(fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.removeUser(fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.removeAllUsers())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.addChannel(fakeChannelData))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.getAllChannels())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.getChannel(fakeChannelData.key))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.getUsersForChannel(fakeChannelData.key))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.deleteChannel(fakeChannelData.key))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.addUserToChannel(fakeChannelData.key, fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database
    .removeUserFromChannel(fakeChannelData.key, fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.clearChannel(fakeChannelData.key))
    .rejects
    .toThrowError(new Error(errorMessage));
});
