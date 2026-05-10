const db = { query: jest.fn(), escape: v => `'${v}'` };
module.exports = db;
