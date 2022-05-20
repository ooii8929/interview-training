const expect = require('chai').expect;
const { isValidEmail } = require('../server/util/util.js');
const { getAllTrainingByUserId } = require('../server/models/training_model.js');

describe('isValidEmail Test', () => {
  it('should equal false', () => {
    const result = isValidEmail('232323232');
    expect(result).to.equal(false);
  });
  it('should equal true', () => {
    const result = isValidEmail('232323@gmail.com');
    expect(result).to.equal(true);
  });
});

describe('model training tests', () => {
  describe('get training by user id Test', () => {
    it('should equal false', () => {
      const result = getAllTrainingByUserId('1');
      expect(result).to.equal(false);
    });
    it('should equal true', () => {
      const result = getAllTrainingByUserId('2');
      expect(result).to.equal(true);
    });
  });
});
