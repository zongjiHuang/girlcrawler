#!/usr/bin/env node

//
// Ericlong233/girlcrawler
//

var async    = require("async"),
    program  = require("commander"),
    request  = require("request"),
    cheerio  = require("cheerio"),
    colors   = require("colors"),
    Progress = require("progress"),
    md5      = require("md5"),
    fs       = require("fs"),
    path     = require("path");

var url    = "http://i.jandan.net/ooxx",
    dir    = "./jandangirls",
    config = dir + "/.config";

var DEFAULT_THREAD  = 64,
    DEFAULT_FILTER  = "oo >= 2 * xx",
    DEFAULT_BUFFER  = 5
    BREAK_IMAGE_MD5 = "9a49736345f17e6c90dfe3bcd74dfb5e";    // 这个不是下载下来的坏图的 md5, 是 request 爬下来的 body 的 md5

program.version("1.3.5")
       .description("简洁、高效的煎蛋妹子图爬虫, powered by Node.js")
       .option("-t, --thread <thread>", "下载" + "最大".underline + "并发数, 默认为 " + DEFAULT_THREAD)
       .option("-f, --filter <filter>", "基于 OO/XX 的过滤器, 默认为 \"" + DEFAULT_FILTER + "\"")
       .option("-b, --buffer <buffer>", "缓冲, 表示在下次更新时, 从往前 N 页开始爬起. 默认为 " + DEFAULT_BUFFER)
       .parse(process.argv);

function getPageCount(callback) {
    request(url, (err, response, body) => {
        var $ = cheerio.load(body);
        var pageCount = +$("span.current-comment-page").eq(0).text().replace(/(\[|\])/g, "");
        callback(null, pageCount);
    });
}

function getConfig(pageCount, callback) {
    var thread, filter, buffer, start, end = pageCount;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    if (!fs.existsSync(config)) {
        thread = program.thread || DEFAULT_THREAD;
        filter = program.filter || DEFAULT_FILTER;
        buffer = program.buffer || DEFAULT_BUFFER;
        start  = 1;
    } else {
        var data = JSON.parse(fs.readFileSync(config, "utf8"));
        thread = program.thread || data.thread || DEFAULT_THREAD;
        filter = program.filter || data.filter || DEFAULT_FILTER;
        buffer = program.buffer || data.buffer || DEFAULT_BUFFER;
        if (data.lastUpdate)
            if (data.lastUpdate - buffer > 0) start = data.lastUpdate - buffer
            else start = 1
        else start = 1;
    }
    callback(null, thread, filter, buffer, start, end);
}

function setConfig(thread, filter, buffer, i, callback) {
    fs.writeFileSync(config, JSON.stringify({
        thread: thread, filter: filter, buffer: buffer, lastUpdate: i
    }));
    callback(null);
}

function getPictureInfos(page, filter, callback) {
    request(url + "/page-" + page + "#comments", (err, response, body) => {

        var $ = cheerio.load(body);
        async.waterfall([
            (callback) => {
                var comments = [];
                $("ol.commentlist li:not(.row)").each((i, element) => {
                    comments.push(cheerio.load($(element).html()));
                });
                callback(null, comments);
            },
            (comments, callback) => {
                var pictures = [];
                for (var item of comments) {
                    var id, urls = [], oo, xx;
                    oo = +item("span.tucao-unlike-container a.like + span").text();
                    xx = +item("span.tucao-unlike-container a.unlike + span").text();
                    if (!eval(filter)) continue;
                    id = item("span.tucao-unlike-container a.like").attr("data-id");
                    item("a.view_img_link").each((i, element) => {
                        urls.push("http:" + $(element).attr("href"));
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

    var breakImage = []
    var bar = new Progress("Downloading page " + page + " [:bar]".blue + " :percent ", {
        total: pictures.length,
        width: 25,
        complete: "#",
        incomplete: "-",
        clear: true
    });

    async.mapLimit(pictures, thread, (item, callback) => {
        if (!item.url) return callback();    // fixed a bug in 3483878, page 123
        request({
            url: item.url,
            headers: {
                "Connection":    "keep-alive",
                "Cache-Control": "max-age=0",
                "User-Agent":    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36"
            }
        }, (err, response, body) => {
            bar.tick();
            if (!body || (md5(body) == BREAK_IMAGE_MD5)) {
                breakImage.push(item.id + path.extname(item.url));
            }
            callback();
        }).pipe(fs.createWriteStream(dir + "/" + item.id + path.extname(item.url)));
    }, (err, result) => {
        for (var i of breakImage) {
            fs.unlinkSync(dir + "/" + i);
        }
        callback();
    })

}

// 虽然用了 async 还是有一些 callback hell...
async.waterfall([

    (callback) => getPageCount(callback),
    (pageCount, callback) => getConfig(pageCount, callback),
    (thread, filter, buffer, start, end, callback) => {

        console.log();
        console.log("爬虫运行中... 参数: " + ("thread=" + thread + ", filter=\"" + filter + "\", buffer=" + buffer).cyan.underline);

        // 遍历每一页
        var i = start;
        async.whilst(() => i <= end, (callback) => {
            async.waterfall([
                (callback) => setConfig(thread, filter, buffer, i, callback),
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
