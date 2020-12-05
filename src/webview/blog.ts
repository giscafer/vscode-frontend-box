import { ViewColumn } from 'vscode';
import { getHtmlFromUrl, getTemplateFileContent } from '../utils';
import ReusedWebviewPanel from './ReusedWebviewPanel';
import * as fs from 'fs';
import * as path from 'path';
import globalState from '../globalState';

export function viewBlogByIframe(title = '前端技术文章', url: string) {
  console.log(url);
  const panel = ReusedWebviewPanel.create(
    'viewBlogByIframe',
    title,
    ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );
  panel.webview.onDidReceiveMessage((message) => {}, undefined);

  panel.webview.html = getTemplateFileContent('blog-iframe.html');

  panel.webview.postMessage({
    command: 'viewBlogByIframeCommand',
    data: { url },
  });
}

export function viewBlog(title = '前端技术文章', url: string) {
  console.log(url);
  const panel = ReusedWebviewPanel.create('viewBlog', title, ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: true,
  });

  getHtmlFromUrl(url).then((html) => {
    const tplPath = path.join(
      globalState.extensionContext.extensionPath,
      'templates',
      'index.html'
    );
    fs.writeFileSync(tplPath, html);

    panel.webview.html = html;
  });
}
