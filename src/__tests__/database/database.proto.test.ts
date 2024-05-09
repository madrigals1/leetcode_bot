import { ChatbotProvider } from '../../chatbots';
import ProtoDatabase from '../../database/database.proto';

test('database.proto class', async () => {
  const database = new ProtoDatabase();
  const errorMessage = 'Not Implemented';

  const fakeUsername = 'fake_username';
  const fakeChannel = {
    id: 1,
    key: {
      chatId: '1231231',
      provider: ChatbotProvider.Discord,
    },
    userLimit: 10,
  };
  const fakeUser = { exists: false };

  await expect(database.connect())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.findAllUsers())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.userExists(fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.addUser(fakeUsername, fakeUser))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.removeUser(fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.updateUser(fakeUsername, fakeUser))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.removeAllUsers())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.addChannel(fakeChannel))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.getAllChannels())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.getChannel(fakeChannel.key))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.getUsersForChannel(fakeChannel.key))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.deleteChannel(fakeChannel.key))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.deleteAllChannels())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.addUserToChannel(fakeChannel.key, fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database
    .removeUserFromChannel(fakeChannel.key, fakeUsername))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.clearChannel(fakeChannel.key))
    .rejects
    .toThrowError(new Error(errorMessage));
});
