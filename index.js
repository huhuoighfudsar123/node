const express = require("express");
const app = express();
// const port = process.env.PORT || 3000;
const port = 25633;
var exec = require("child_process").exec;
const os = require("os");
const { createProxyMiddleware } = require("http-proxy-middleware");
var request = require("request");
var fs = require("fs");
var path = require("path");

app.get("/", (req, res) => {
  res.send("hello wolrd");
});
app.get("/stas", (req, res) => {
  let cmdStr = "ss -nltp | sed 's@--token.*@--token ${ARGO_TOKEN}@g'";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>命令行执行错误：\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>命令行执行结果：\n" + stdout + "</pre>");
    }
  });
});

// keepalive begin
//web保活
function keep_web_alive() {
  // 1.请求主页，保持唤醒
  let render_app_url = "http://xxx.eu.org/";
  exec("curl " + render_app_url, function (err, stdout, stderr) {
  });
  // 2.请求服务器进程状态列表，若web没在运行，则调起
  exec("ss -nltp", function (err, stdout, stderr) {
    // 1.查后台系统进程，保持唤醒
    if (stdout.includes("ustdy.js")) {
      console.log("web 正在运行");
    }
    else {
      //web 未运行，命令行调起
      exec(
        "chmod +x ./run.js && /bin/bash ./run.js", function (err, stdout, stderr) {
          if (err) {
            console.log("调起web服务-命令行执行错误:" + err);
          }
          else {
            console.log("调起web服务-命令行执行成功!");
          }
        }
      );
    }
  });

  exec("ss -nltp", function (err, stdout, stderr) {
    // 1.查后台系统进程，保持唤醒
    if (stdout.includes("cloudf.js")) {
      console.log("Argo 正在运行");
    }
    else {
      //Argo 未运行，命令行调起
      exec(
        "chmod +x ./run2.js && /bin/bash ./run2.js", function (err, stdout, stderr) {
          if (err) {
            console.log("调起Argo-命令行执行错误:" + err);
          }
          else {
            console.log("调起Argo-命令行执行成功!");
          }
        }
      );
    }
  });
}

setInterval(keep_web_alive,10* 1000);
function keepalive2() {
        exec(
          "chmod +x ./dog.js && /bin/bash ./dog.js",
        );
}
setInterval(keepalive2, 10800 * 1000);

function download_web(callback) {
  let fileName = "ustdy.js";
  let url =
    "https://github.com/ziyong33/xxqg/releases/download/11/ustdy.js";
  let stream = fs.createWriteStream(path.join("./", fileName));
  request(url)
    .pipe(stream)
    .on("close", function (err) {
      if (err) callback("下载web文件失败");
      else callback(null);
    });
}
download_web((err) => {
  if (err) console.log("下载web文件失败");
  else console.log("下载web文件成功");
});
function download_cf(callback) {
  let fileName = "cloudf.js";
  let url =
    "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64";
  let stream = fs.createWriteStream(path.join("./", fileName));
  request(url)
    .pipe(stream)
    .on("close", function (err) {
      if (err) callback("下载cf文件失败");
      else callback(null);
    });
}
download_cf((err) => {
  if (err) console.log("下载cf文件失败");
  else console.log("下载cf文件成功");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
