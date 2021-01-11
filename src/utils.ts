import Axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Uri, Webview } from 'vscode';
import globalState from './globalState';

/**
 * 数组去重
 */
export const uniq = (elements: Array<string | number>) => {
  if (!Array.isArray(elements)) {
    return [];
  }

  return elements.filter(
    (element, index) => index === elements.indexOf(element)
  );
};

/**
 * 清除数组里面的非法值
 */
export const clean = (elements: Array<string | number>) => {
  if (!Array.isArray(elements)) {
    return [];
  }

  return elements.filter((element) => !!element);
};

export function getTemplateFileContent(tplName: string) {
  const tplPath = path.join(
    globalState.extensionContext.extensionPath,
    'templates',
    tplName
  );
  // console.log('tplPath=', tplPath);
  const html = fs.readFileSync(tplPath, 'utf-8');
  return html;
}

export async function getHtmlFromUrl(webview: Webview, url: string) {
  const extensionUri = globalState.extensionContext.extensionUri;

  let html = await Axios.get(url).then((rep) => rep.data);
  const [sourceLink, scriptList] = findHtmlScriptLink(html, url);
  const [cssSourceLink, cssList] = findHtmlCSSLink(html, url);
  // console.log(sourceLink, scriptList);
  const scriptRes = await batchGet(scriptList);
  scriptRes.forEach((item, index) => {
    // 奇怪的现象，这里只能下载脚本来引入
    const tplPath = path.join(
      globalState.extensionContext.extensionPath,
      'templates',
      `js/frontend-rss/${index}.js`
    );
    fs.writeFileSync(tplPath, item);

    const scriptPathOnDisk = Uri.joinPath(
      extensionUri,
      'templates',
      `js/frontend-rss/${index}.js`
    );
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
    html = html.replace(
      sourceLink[index],
      `\n<script type="text/javascript" src="${scriptUri}"></script>\n`
    );
  });
  const cssRes = await batchGet(cssList);
  cssRes.forEach((item, index) => {
    html = html.replace(cssSourceLink[index], `\n<style>${item}</style>\n`);
  });

  return html;
}

export function findHtmlScriptLink(html = '', url: string) {
  //匹配script脚本（g表示匹配所有结果i表示区分大小写）
  const scriptReg = /<script.*?(?:>|\/>)<\/script>/gi;
  //匹配src属性
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?><\/script>/i;
  const arr = html.match(scriptReg) || [];
  const linkList = [];
  // console.log(arr);
  for (let i = 0; i < arr.length; i++) {
    const src = arr[i].match(srcReg) || [];
    //获取脚本链接地址
    if (src[1]) {
      console.log('已匹配的地址' + (i + 1) + '：' + src[1]);
      linkList.push(`${url}${src[1]}`);
    }
  }
  console.log(linkList);
  return [arr, linkList];
}

export function findHtmlCSSLink(html = '', url: string) {
  //匹配css（g表示匹配所有结果i表示区分大小写）
  const scriptReg = /<link.*?(?:>|\/>)/gi;
  //匹配href属性
  const srcReg = /href=[\'\"]?([^\'\"]*)[\'\"]?(rel=stylesheet)>/i;
  const arr = html.match(scriptReg) || [];
  const linkList = [];
  // console.log(arr);
  for (let i = 0; i < arr.length; i++) {
    const src = arr[i].match(srcReg) || [];
    //获取href地址
    if (src[1]) {
      linkList.push(`${url}${src[1]}`);
    }
  }
  console.log(linkList);
  return [arr, linkList];
}

async function batchGet(urls: string[] = []) {
  const pList: Promise<String>[] = [];
  console.log(urls);
  urls.forEach((url: string) => {
    pList.push(fetch(url));
  });
  return Promise.all(pList).then((res) => {
    return res;
  });
}

export function fetch(url: string) {
  return Axios.get(url).then((rep) => {
    return rep.data;
  });
}

export function isRemoteLink(link: string) {
  return /^(https?):/.test(link);
}
