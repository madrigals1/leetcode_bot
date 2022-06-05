import buttonIndexer from '../../../chatbots/discord/buttonIndexer';

test('chatbots.discord.buttonIndexer function', async () => {
  let currentId = buttonIndexer.id;

  // Add button
  const button1 = { text: 'Random text', action: '/random action' };
  const sid1 = buttonIndexer.addButton(button1);
  expect(sid1).toBe(`button_${currentId}`);
  expect(buttonIndexer.getButton(sid1)).toBe(button1);
  expect(buttonIndexer.id).toBe(currentId + 1);
  currentId += 1;

  // Add multiple buttons
  const buttons = [
    { text: 'Random text 1', action: '/random action one' },
    { text: 'Random text 2', action: '/random action two' },
    { text: 'Random text 3', action: '/random action three' },
  ];
  buttons.forEach((button) => {
    const sid = buttonIndexer.addButton(button);
    expect(sid).toBe(`button_${currentId}`);
    expect(buttonIndexer.getButton(sid)).toBe(button);
    expect(buttonIndexer.id).toBe(currentId + 1);
    currentId += 1;
  });

  // Add select
  const sid2 = buttonIndexer.addSelect();
  expect(sid2).toBe(`select_${currentId}`);
  expect(buttonIndexer.id).toBe(currentId + 1);
  currentId += 1;

  // Add multiple selects
  for (let i = 0; i < 3; i++) {
    const sid = buttonIndexer.addSelect();
    expect(sid).toBe(`select_${currentId}`);
    expect(buttonIndexer.id).toBe(currentId + 1);
    currentId += 1;
  }
});
