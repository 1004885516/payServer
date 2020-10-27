'use strict';


const axios = require('axios');

function sendMsg(cbkUrl, data, ctx) {
    const url = cbkUrl;
    return new Promise((resolve, reject)=>{
        axios.post(url, data)
        .then(function (response) {
            const result = response.data
            resolve(result);
        })
        .catch(function (error) {
            console.log('error', error)
            reject(error);
        });
    })
}

module.exports = {
    sendMsg
};