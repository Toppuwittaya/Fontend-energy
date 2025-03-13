module.exports = {
    address: "http://localhost:5001/api/",
};

const { address } = require("./api");

const api = {
    login: `${address}/login`,
};

module.exports = { api };
