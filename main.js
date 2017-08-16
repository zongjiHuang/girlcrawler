#!/usr/bin/env node
//
// Ericlong233/girlcrawler
//

const async    = require("async"),
      program  = require("commander"),
      request  = require("request"),
      cheerio  = require("cheerio"),
      colors   = require("colors"),
      Progress = require("progress"),
      fs       = require("fs"),
      path     = require("path");

program.version("1.0")
       .option("-t, --thread <thread>", "The maximum number of concurrent downloads, default 128")
       .option("-f, --filter <filter>", "OO/XX based filter, default \"oo > xx\"")
       .parse(process.argv);

const url = "http://jandan.net/ooxx",
      dir = "./jandangirls";

function getPageCount(callback) {
    request(url, (err, response, body) => {
        var $ = cheerio.load(body);
        var pageCount = +$("span.current-comment-page").eq(0).text().replace(/(\[|\])/g, "");
        callback(null, pageCount);
    });
}

// TODO: 在每一次下载前写入配置
function config(pageCount, callback) {
    var configPath = dir + "/config.json",
        thread, filter, start, end = pageCount;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    if (!fs.existsSync(configPath)) {
        thread = program.thread || 128;
        filter = program.filter || "oo > xx";
        start  = 1;
    } else {
        var data = JSON.parse(fs.readFileSync(configPath, "utf8"));
        thread = program.thread || data.thread || 128;
        filter = program.filter || data.filter || "oo > xx";
        start  = data.lastUpdate || 1;
    }
    fs.writeFileSync(configPath, JSON.stringify({
        thread: thread, filter: filter, lastUpdate: end
    }));
    callback(null, thread, filter, start, end);
}

function getPictureInfos(page, filter, callback) {
    request(url + "/page-" + page + "#comments", (err, response, body) => {

        var $ = cheerio.load(body);
        async.waterfall([
            (callback) => {
                var comments = [];
                $("ol.commentlist li").each((i, element) => {
                    comments.push(cheerio.load($(element).html()));
                    // console.log($(element).html());
                });
                callback(null, comments);
            },
            (comments, callback) => {
                var pictures = [];
                for (var item of comments) {
                    var id, urls = [], oo, xx;
                    oo = +item("span.tucao-like-container span").text();
                    xx = +item("span.tucao-unlike-container span").text();
                    if (!eval(filter)) continue;
                    id = item("span.tucao-like-container a").attr("data-id");
                    item("img").each((i, element) => {
                        // 有 org_src 的则为 gif 图.
                        // 此时如果获取 src 图不会动, 只有 org_src 会动.
                        if (item(element).attr("org_src")) {
                            urls.push("http:" + $(element).attr("org_src"));
                            // console.log("http:" + $(element).attr("org_src"));
                        } else {
                            urls.push("http:" + $(element).attr("src"));
                            // console.log("http:" + $(element).attr("src"));
                        }
                    });
                    if (urls.length > 1) {
                        var j = 1;
                        for (var i of urls) {
                            pictures.push({id: id + "-" + j++, url: i, oo: oo, xx: xx});
                        }
                    } else {
                        pictures.push({id: id, url: urls[0], oo: oo, xx: xx});
                    }
                }
                callback(null, pictures);
            },
        ], (err, result) => {
            callback(err, result);
        });

    });
}

function downloadPics(page, pictures, thread, callback) {
    var bar = new Progress("Downloading page " + page + " [:bar]".blue + " :percent ", {
        total: pictures.length,
        complete: "#",
        incomplete: "-",
        clear: true
    })
    async.mapLimit(pictures, thread, (item, callback) => {
        request({
            url: item.url,
            headers: {
                "Connection":    "keep-alive",
                "Cache-Control": "max-age=0",
                "User-Agent":    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36"
            }
        }, (err, response, body) => {
            bar.tick();
            callback();
        }).pipe(fs.createWriteStream(dir + "/" + item.id + path.extname(item.url)));
    }, (err, result) => {
        callback();
    })
}

// 虽然用了 async 还是有一些 callback hell...
async.waterfall([

    (callback) => getPageCount(callback),
    (pageCount, callback) => config(pageCount, callback),
    (thread, filter, start, end, callback) => {

        console.log();
        console.log("Running crawler with arguments: " + ("thread=" + thread + ", filter=\"" + filter + "\"").cyan.underline);

        // 遍历每一页
        var i = start;
        async.whilst(() => i <= end, (callback) => {
            async.waterfall([
                (callback) => getPictureInfos(i, filter, callback),
                (pictures, callback) => downloadPics(i, pictures, thread, callback),
            ], (err, result) => {
                i++;
                callback(err, result);
            });
        }, (err, result) => {
            callback(err, result);
        });

    },

], (err, result) => {
    console.log("** F I N I S H E D ! **\n".rainbow)
});
