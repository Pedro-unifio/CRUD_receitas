test('banco SQLite usa arquivo local por padrão', () => {
  const oldPath = process.env.DB_PATH;
  const Sequelize = jest.fn();
  try {
    delete process.env.DB_PATH;
    jest.doMock('sequelize', () => ({ Sequelize }));
    jest.isolateModules(() => require('../src/database'));
    expect(Sequelize).toHaveBeenCalledWith(expect.objectContaining({ dialect: 'sqlite', storage: expect.stringContaining('dados.sqlite') }));
  } finally {
    if (oldPath === undefined) delete process.env.DB_PATH;
    else process.env.DB_PATH = oldPath;
    jest.unmock('sequelize');
  }
});
