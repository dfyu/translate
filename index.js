#!/usr/bin/env node
const fetch = require('node-fetch')
const http = require("http")
const arg = require('arg')
const sound = require('@dfyu/sound')
const log = console.log
const craeteSeparation = () => log(new Array(60).fill("=").join(""))

let args = null
try {
  args = arg({
    '-s': Boolean,
    '--s': Boolean
  });
} catch (err) {
  console.log(err.message);
  process.exit(0)
}

const isSentence = !!args['-s']
const openSound = !!args['--s']
const words = args['_']

async function translate (string) {
  const data = await fetch("https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "content-type": "application/x-www-form-urlencoded",
    },
    "body": `q=${encodeURIComponent(string)}&le=en&t=1&client=web&keyfrom=webdict`,
    "method": "POST",
  }).then(res => res.json())
  const result = data?.fanyi?.tran || data?.ce?.word?.trs?.[0]?.['#text'] || data?.ec?.word?.trs?.[0]?.tran
  console.log(result)

  return result
}

(async () => {
  const reg = /^[a-zA-Z,.\s-\'\"!\?\(\)\[\]\&0-9]+$/

  if (args && words.length > 0) {
    if (isSentence) {
      const string = words.join(' ')
      const result = await translate(string)

      if (openSound) {
        if (reg.test(string)) {
          await sound(string)
        } else if (reg.test(result)) {
          await sound(result)
        }
      }
    } else {
      craeteSeparation()
      for await (let word of words) {
        console.log(word)
        const result = await translate(word)

        if (openSound) {
          if (reg.test(word)) {
            await sound(word)
          } else if (reg.test(result)) {
            await sound(result)
          }
        }

        craeteSeparation()
      }
    }
  } else {
    log("请输入待翻译词语，多个词语请用空格隔开, 若翻译句子加上参数 -s, 若需要朗读翻译加上参数 --s")
    log("例如: translate hello")
    log("例如: translate hello --s")
    log("例如: translate hello world")
    log("例如: translate hello world --s")
    log("例如: translate -s \"hello world\"")
    log("例如: translate -s \"hello world\" --s")
  }
})();

