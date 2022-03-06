import ProtoDatabase from '../../database/database.proto';

test('database.proto class', async () => {
  const database = new ProtoDatabase();
  const errorMessage = 'Not Implemented';

  await expect(database.connect())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.findAllUsers())
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.userExists('asd'))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.addUser('asd'))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.removeUser('asd'))
    .rejects
    .toThrowError(new Error(errorMessage));
  await expect(database.removeAllUsers())
    .rejects
    .toThrowError(new Error(errorMessage));
});
