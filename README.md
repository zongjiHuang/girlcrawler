# GirlCrawler

![example](https://raw.githubusercontent.com/Ericlong233/girlcrawler/master/res/example.png)

 [V2EX](https://www.v2ex.com/t/383493) | [Github](https://github.com/Ericlong233/girlcrawler) | [npm](https://www.npmjs.com/package/girlcrawler) | [更新日志](https://github.com/Ericlong233/girlcrawler/blob/master/CHANGELOG.md) | [欢迎 Star](https://github.com/Ericlong233/girlcrawler)

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

* **在线安装 (推荐)：** 执行`npm install girlcrawler -g` 。
* **手动安装：**
  1. 执行 `git clone http://github.com/Ericlong233/girlcrawler.git` 将项目克隆到本地。
  2. 执行 `npm install ./girlcrawler -g` 。

* 以后，可以直接执行 `girlcrawler` 来运行爬虫。
* **注意：** 一定不要漏掉 `-g` ！需要卸载时，输入 `npm uninstall girlcrawler -g` 即可。

### 开源组件

* [async](https://github.com/caolan/async) - 异步操作整理
* [commander](https://github.com/tj/commander.js/) - 命令行参数
* [request](https://github.com/request/request) - 向服务器发出请求
* [cheerio](https://github.com/cheeriojs/cheerio) - 解析 HTML
* [colors](https://github.com/Marak/colors.js) - 终端字体颜色
* [progress](https://github.com/visionmedia/node-progress) - 终端进度条

### 协议

[MIT License](https://github.com/Ericlong233/girlcrawler/blob/master/LICENSE)
