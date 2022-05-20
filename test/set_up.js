const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const app = require('../app');
var chaiHttp = require('chai-http');

const { isValidEmail } = require('../server/util/util.js');
const { getVideoQuestions } = require('../server/models/training_model.js');
const { signUp } = require('../server/controllers/user_controller.js');
const { signUpToStudent } = require('../server/models/user_model.js');

chai.use(chaiHttp);
const requester = chai.request(app).keepOpen();

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

// describe('model training tests', () => {
//   describe('get training by user id Test', () => {
//     it('should equal false', () => {
//       const result = getVideoQuestions('backend');
//       expect(result).should.have.property('errors');
//     });
//     it('should equal true', () => {
//       const result = getVideoQuestions('frontend');
//       expect(result).should.have.property('errors');
//     });
//   });
// });

// var agent = request.agent(app);
// agent
//   .post('/api/v1/account/login')
//   .send({ _email: 'test@test.com', _password: 'testtest' })
//   .then(function (res) {
//     agent.get('/api/v1/user/me').then(function (res2) {
//       // should get status 200, which indicates req.session existence.
//       res2.should.have.status(200);
//       done();
//     });
//   });

describe('isValidEmail Test', () => {
  it('should equal false', async () => {
    const result = await signUpToStudent('232323wefe232', 'weqwe@gmail.com', 'fefefefe');
    expect(result).to.be.a('object');
  });
  it('should equal true', async () => {
    const result = await signUpToStudent('232323232', '232323@gmail.com', '2323');
    expect(result).to.be.a('object');
  });
});

// describe('Test group', function () {
//   var host = 'http://' + process.env.API_HOSTNAME + '/api/' + process.env.API_VERSION;
//   var path = '/signup';

//   it('should send parameters to : /path POST', function (done) {
//     chai
//       .request(app)
//       .post(path)
//       .send({ identity: 'student', name: '2323', email: 'o213124124@gmail.com', password: 'test' })
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a('array');
//         res.body.length.should.be.eql(0);
//         done();
//       });
//   });
// });

module.exports = {
  expect,
  assert,
  requester,
};
