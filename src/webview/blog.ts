import * as fs from 'fs';
import * as path from 'path';
import { ViewColumn } from 'vscode';
import globalState from '../globalState';
import { getHtmlFromUrl, getTemplateFileContent } from '../utils';
import ReusedWebviewPanel from './ReusedWebviewPanel';

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
    command: 'viewBlogCommand',
    data: { url },
  });
}

export function viewBlogByMarkdown(title = '前端技术文章', url: string) {
  const panel = ReusedWebviewPanel.create(
    'viewBlogByMarkdown',
    title,
    ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );
  panel.webview.onDidReceiveMessage((message) => {}, undefined);

  panel.webview.html = getTemplateFileContent('markdown-blog.html');

  panel.webview.postMessage({
    command: 'viewBlogCommand',
    data: { url },
  });
}

export function viewBlog(title = '前端技术文章', url: string) {
  // console.log(url);
  const panel = ReusedWebviewPanel.create('viewBlog', title, ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: true,
  });

  getHtmlFromUrl(panel.webview, url).then((html) => {
    const tplPath = path.join(
      globalState.extensionContext.extensionPath,
      'templates',
      'frontend-rss.html'
    );
    fs.writeFileSync(tplPath, html);

    panel.webview.html = html;
  });
}
