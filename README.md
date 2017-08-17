# GirlCrawler

![example](https://raw.githubusercontent.com/Ericlong233/girlcrawler/master/res/example.png)

[Github](https://github.com/Ericlong233/girlcrawler) | [npm](https://www.npmjs.com/package/girlcrawler) | [更新日志](https://github.com/Ericlong233/girlcrawler/blob/master/CHANGELOG.md) | [欢迎 Star](https://github.com/Ericlong233/girlcrawler)

*注意：适当撸妹益脑，过度撸妹伤身。请在遵守当地法律法规的前提下使用。煎蛋网资源有限，请适当使用。*

### 介绍

GirlCrawler 是一个简洁、高效的[煎蛋妹子图](http://jandan.net/ooxx)爬虫。它基于高效、异步的 Node.js。具有以下特性：

* 快速，由 Node.js 的异步 I/O 提供支持
* 基于 OO/XX 的过滤器
* 友好的 CLI 界面
* 通过 MD5 自动过滤失效图片 (1.2.0 版更新内容)

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
* [md5](https://github.com/pvorb/node-md5) - MD5 计算

### 协议

[MIT License](https://github.com/Ericlong233/girlcrawler/blob/master/LICENSE)
