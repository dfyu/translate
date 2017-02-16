'use strict';
var http = require('http'),
    words = [].concat(process.argv),
    log = console.log,
    minProcessLength = 2,
    defaultPort = 80;

function createOptions (translateStr) {
    return {
        hostname: `fanyi.youdao.com`,
        port: defaultPort,
        path: `/openapi.do?keyfrom=richole&key=1196902348&type=data&doctype=json&version=1.1&q=${encodeURIComponent(translateStr)}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

function craeteSeparation () {
    log(new Array(60).join('='));
}

if (words.length > 2) {
    words.splice(0, 2);
    words.forEach((val, index) => {
        var thisRequest,
            thisChunk = '',
            thisData;
        thisRequest = http.request(createOptions(val), (res) => {
            res.setEncoding('utf-8');
            res.on('data', (chunk) => {
                thisChunk += chunk;
            });
            res.on('end', (chunk) => {
                thisData = JSON.parse(thisChunk);
                log(thisData.translation.join('  '));
                if (thisData.basic && thisData.basic.explains) {
                    log(thisData.basic.explains.join('\n'));
                }
                if (thisData.web) {
                    thisData.web.forEach((item) => {
                        log(`${item.key}: ${item.value.join(',')}`);
                    });
                }
                craeteSeparation();
            });
        });
        thisRequest.on('error', (e) => {
            log(`problem with request: ${e.message}`);
            craeteSeparation();
        });
        thisRequest.end();
    });
} else {
    log(`请输入待翻译词语，多个词语请用空格隔开`);
}
