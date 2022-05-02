// constants.js
const API = {
    VER1: '1.0',
    VER2: '2.0',
};
const URL = {
    LOCAL: 'http://localhost:3000',
    EC2: 'https://wooah.app',
};

const urlPrefix = URL.LOCAL + '/api/' + API.VER1;

export default urlPrefix;
