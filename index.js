#!/usr/bin/env node
const http = require("http")
const log = console.log
const craeteSeparation = () => log(new Array(60).fill("=").join(""))
let words = process.argv.slice(2)

if (words.length > 0) {
    if (words.filter(item => item === "-s").length >= 1) {
        words = [words.filter(item => item !== "-s").join(" ")]
    }
    words.forEach(word => {
        const url = `http://fanyi.youdao.com/openapi.do?keyfrom=richole&key=1196902348&type=data&doctype=json&version=1.1&q=${encodeURIComponent(word)}`
        let thisChunk = ""
        const thisRequest = http.get(new URL(url), {
            headers: {
                "Content-Type": "application/json"
            }
        }, res => {
            res.setEncoding("utf-8")

            res.on("data", chunk => {
                thisChunk += chunk.toString()
            })

            res.on("end", () => {
                const thisData = JSON.parse(thisChunk)
                craeteSeparation()
                log(word)
                log(thisData.translation.join("  "))
                if (thisData.basic && thisData.basic.explains) {
                    log(thisData.basic.explains.join("\n"))
                }
                if (thisData.web) {
                    thisData.web.forEach((item) => {
                        log(`${item.key}: ${item.value.join(",")}`)
                    })
                }
                craeteSeparation()
            })
        })
        thisRequest.on("error", (e) => {
            log(`error: ${e.message}`)
            craeteSeparation()
        })
        thisRequest.end()
    })
} else {
    log("请输入待翻译词语，多个词语请用空格隔开, 若翻译句子加上参数 -s")
    log("例如: translate hello")
    log("例如: translate -s hello world")
}
