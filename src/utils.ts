import Axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import globalState from './globalState';

export function getTemplateFileContent(tplName: string) {
  const tplPath = path.join(
    globalState.extensionContext.extensionPath,
    'templates',
    tplName
  );
  console.log('tplPath=', tplPath);
  const html = fs.readFileSync(tplPath, 'utf-8');
  return html;
}

export async function getHtmlFromUrl(url: string) {
  let html = await Axios.get(url).then((rep) => rep.data);
  const [sourceLink, scriptList] = findHtmlScriptLink(html, url);
  const [cssSourceLink, cssList] = findHtmlCSSLink(html, url);
  console.log(sourceLink, scriptList);
  const scriptRes = await batchGet(scriptList);
  scriptRes.forEach((item, index) => {
    console.log(sourceLink[index]);
    const tplPath = path.join(
      globalState.extensionContext.extensionPath,
      'templates',
      `${index}.js`
    );
    fs.writeFileSync(tplPath, item);

    if (index === 4) {
      html = html.replace(
        sourceLink[œ],
        `\n<script type="text/javascript" src="./${index}.js"></script>\n`
      );
    } else {
      console.log(111, item.length);
      html = html.replace(
        sourceLink[index],
        `
        <script type="text/javascript">
        ${item}
        </script>\n`
      );
    }
    /*  html = html.replace(
      sourceLink[index],
      `\n<script type="text/javascript" src="./${index}.js"></script>\n`
    ); */
  });
  const cssRes = await batchGet(cssList);
  cssRes.forEach((item, index) => {
    html = html.replace(cssSourceLink[index], `\n<style>${item}</style>\n`);
  });
  sourceLink.forEach((item) => {
    html = html.replace(item, '$&');
  });
  console.log(
    222,
    html.indexOf(
      '<script type=text/javascript src=/static/js/vendor.dfe1b4f115d599289330.js></script>'
    )
  );
  const tplPath2 = path.join(
    globalState.extensionContext.extensionPath,
    'templates',
    `aaa.js`
  );
  fs.writeFileSync(tplPath2, scriptRes[1]);
  return html;
}

export function findHtmlScriptLink(html = '', url: string) {
  //匹配script脚本（g表示匹配所有结果i表示区分大小写）
  const scriptReg = /<script.*?(?:>|\/>)<\/script>/gi;
  //匹配src属性
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?><\/script>/i;
  const arr = html.match(scriptReg) || [];
  const linkList = [];
  console.log(arr);
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
  console.log(arr);
  for (let i = 0; i < arr.length; i++) {
    const src = arr[i].match(srcReg) || [];
    //获取href地址
    if (src[1]) {
      console.log('已匹配的地址' + (i + 1) + '：' + src[1]);
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
    pList.push(
      Axios.get(url).then((rep) => {
        return rep.data;
      })
    );
  });
  return Promise.all(pList).then((res) => {
    return res;
  });
}
