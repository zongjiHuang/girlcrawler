# GirlCrawler

![example](https://raw.githubusercontent.com/Ericlong233/girlcrawler/master/res/example.png)

### 介绍

GirlCrawler 是一个快速、智能的[煎蛋妹子图](http://jandan.net/ooxx)爬虫。它基于高效、异步的 Node.js。具有以下特性：

* 快速，由 Node.js 的异步 I/O 提供支持
* 基于 OO/XX 的过滤器
* 更新优化

### 用法

`girlcrawler [options]`

* `-t, --thread` 下载*最大*并发数，默认为 64。由于网速的快慢，即使这个值非常大，也可能不会有任何速度上的提升。
* `-f, --filter` 基于 OO/XX 的过滤器，默认为 “oo > xx”。

### 安装

 在终端 (Mac & Linux) 或 命令提示符 (Windows)，执行`npm install girlcrawler -g` 。以后，可以直接使用 `girlcrawler` 来运行爬虫。

### 待办清单

* [ ] 添加更多选项

### 开源组件

* async [github.com/caolan/async](https://github.com/caolan/async)
* commander [github.com/tj/commander.js/](https://github.com/tj/commander.js/)
* request [github.com/request/request](https://github.com/request/request)
* cheerio [github.com/cheeriojs/cheerio](https://github.com/cheeriojs/cheerio)
* colors [github.com/Marak/colors.js](https://github.com/Marak/colors.js)
* progress [github.com/visionmedia/node-progress](https://github.com/visionmedia/node-progress)

### 协议

[MIT License](https://github.com/Ericlong233/girlcrawler/blob/master/LICENSE)
