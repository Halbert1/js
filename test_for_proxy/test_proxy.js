const request = require('request');
const co = require('co');
const iconv = require('iconv-lite');
const zlib = require('zlib');
//const bufferHelper = require('bufferHelper');
/*
 let options = {
 //"url": "https://www.toutiao.com/c/user/article/?page_type=0&user_id=4983314259&max_behot_time=0&count=5&as=A1054A73DA72622&cp=5A3A3256A2D28E1&_signature=NfaKngAAb9PKCXVhgsLawDX2io",
 "url":"https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=ip&rsv_pq=acac493f00003a48&rsv_t=f8a932gJFNJotewXkZjlkTuSfSYHwc8K%2FGJEuwvfPkrr8oWRTFzUVpDYCRM&rqlang=cn&rsv_enter=1&rsv_sug3=2&rsv_sug1=2&rsv_sug7=100&rsv_sug2=0&inputT=503&rsv_sug4=503",
 //"url":"http://backholeschedulecenterprea.test.uae.uc.cn/index.html#/jobs?_k=fkvzd4",
 "encoding": null,
 "timeout": 120000,
 "headers": {
 "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,;q=0.8",
 "accept-encoding": "gzip, deflate, br",
 "accept-language": "zh,zh-CN;q=0.8,en;q=0.6,id;q=0.4,vi;q=0.2,zh-TW;q=0.2",
 "cache-control": "no-cache",
 "dnt": 1,
 "pragma": "no-cache",
 "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36 windows-chrome",
 "referer": "https://www.toutiao.com/c/user/article/?page_type=0&user_id=4983314259&max_behot_time=0&count=5&as=A1054A73DA72622&cp=5A3A3256A2D28E1&_signature=NfaKngAAb9PKCXVhgsLawDX2io"
 },
 "method": "GET",
 //"proxy": "http://HK8H635068X620JD:1293120E439454AC@proxy.abuyun.com:9020"
 //"proxy": "http://47.254.22.85:8888"
 //"proxy": "http://100.84.248.132:8888"
 }*/

let options = {
    "url": "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=ip&rsv_pq=acac493f00003a48&rsv_t=f8a932gJFNJotewXkZjlkTuSfSYHwc8K%2FGJEuwvfPkrr8oWRTFzUVpDYCRM&rqlang=cn&rsv_enter=1&rsv_sug3=2&rsv_sug1=2&rsv_sug7=100&rsv_sug2=0&inputT=503&rsv_sug4=503",
    //"url":"http://backholeschedulecenterprea.test.uae.uc.cn/index.html#/jobs?_k=fkvzd4",
    "encoding": null,
    "timeout": 120000,
    "method": "GET",
    "headers": {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": "__cfduid=d8b05cf0229864cd7ff2417552f2fb8b81489575168; BAIDUID=6A59550596122CE4E43C2600A77EF287:FG=1; BIDUPSID=6A59550596122CE4E43C2600A77EF287; PSTM=1498358660; BD_UPN=12314353; sugstore=1; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; pgv_pvi=3061947392; BD_HOME=0; H_PS_PSSID=1453_24569_21104_18559_17001_25177_20930; BD_CK_SAM=1; PSINO=6; H_PS_645EC=36fbH2dEb15%2B1nlQgbNugJvRRn%2B4NZK2PLGGNHn8P1DIGvnmGXNcmCXm3J4; BDSVRTM=7",
        "Host": "www.baidu.com",
        "Pragma": "no-cache",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
    },
    "proxy": "http://47.254.22.85:8888"
};
function get() {
    return new Promise(function (resolve) {
        let req = request(options, (error, response, body) => {
            console.log('==+:',response.statusCode);
            if (!error) {
                let encoding = response.headers['content-encoding'];
                if (encoding === 'gzip') {
                    zlib.gunzip(body, (err, decodeBody) => {
                        if (!!err) {
                            body = decodeBody;
                        }
                        else {
                            body = decodeBody;
                        }
                        let thisContentType = response.headers['content-type'] ? response.headers['content-type'].toLowerCase() : response.headers['content-type'];
                        console.log(thisContentType);
                        if (thisContentType && thisContentType.indexOf("charset=") > -1) {
                            let charset = thisContentType.substring(thisContentType.indexOf("charset=") + 8, thisContentType.length);
                            console.log(charset);
                            //body = body.toString();
                            console.log(body.toString());
                            //charset = 'GBK';
                            charset = 'utf-8';
                            body = iconv.decode(body, charset);
                            console.log(body);
                        }
                        else {
                            body = body.toString();
                            console.log(body);
                        }
                    });
                }
            }
            else {
                console.log(`error:${error}`);
                console.log();
            }
        });
    });
}

get();