// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { commands, ExtensionContext, window } from 'vscode';
import { BaseConfig } from './BaseConfig';
import { BrowserViewWindowManager } from './browser/BrowserViewWindowManager';
import { Telemetry } from './browser/telemetry';
import globalState from './globalState';
import { fetch, isRemoteLink } from './utils';
import { BlogProvider } from './view/blogProvider';
import { MarkbookProvider } from './view/markProvider';
import { ReadLaterProvider } from './view/ReadlaterProvider';
import { viewBlogByIframe, viewBlogByMarkdown } from './webview/blog';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "frontend-box" is now active!');
  globalState.extensionContext = context;

  const blogNodeProvider = new BlogProvider();
  const markNodeProvider = new MarkbookProvider();
  const readLaterProvider = new ReadLaterProvider();
  const blogView = window.createTreeView('view.blog', {
    treeDataProvider: blogNodeProvider,
  });
  const markView = window.createTreeView('view.mark', {
    treeDataProvider: markNodeProvider,
  });
  const readLaterView = window.createTreeView('view.readlater', {
    treeDataProvider: readLaterProvider,
  });
  blogNodeProvider.refresh();
  markNodeProvider.refresh();
  readLaterProvider.refresh();

  //  内置浏览器
  const telemetry = new Telemetry();

  const windowManager = new BrowserViewWindowManager(
    context.extensionPath,
    telemetry
  );

  telemetry.sendEvent('activate');

  context.subscriptions.push(
    commands.registerCommand('frontend-box.openPreview', (url?) => {
      telemetry.sendEvent('openPreview');
      windowManager.create(url);
    }),

    commands.registerCommand('frontend-box.openActiveFile', () => {
      const activeEditor = window.activeTextEditor;
      if (!activeEditor) {
        return; // no active editor: ignore the command
      }

      // get active url
      const filename = activeEditor.document.fileName;

      telemetry.sendEvent('openActiveFile');

      if (filename) {
        windowManager.create(`file://${filename}`);
      }
    })
  );

  globalState.events.addListener('refresh-view', (type) => {
    if (type === 'mark' && markView.visible) {
      markNodeProvider.refresh();
    } else if (type === 'blog' && blogView.visible) {
      blogNodeProvider.refresh();
    } else if (type === 'readlater' && readLaterView.visible) {
      readLaterProvider.refresh();
    }
  });

  context.subscriptions.push(
    commands.registerCommand('readlater.add', (url, title) => {
      window
        .showInputBox({
          placeHolder: '粘贴网址URL',
        })
        .then((url: any) => {
          if (!url) {
            return;
          }
          if (!isRemoteLink(url)) {
            window.showErrorMessage('添加失败，URL 必须是 http 或 https 开头');
            return;
          }
          fetch(url).then((res) => {
            const matcher = res.match(/<title>([\S\s]*?)<\/title>/);
            const title = matcher[1];
            BaseConfig.updateConfig('frontend-box.readlater', [
              { title, url },
            ]).then(() => {
              globalState.events.emit('refresh-view', 'readlater');
            });
          });
        });
    }),
    commands.registerCommand('readlater.delete', ({ id }) => {
      BaseConfig.removeConfig('frontend-box.readlater', id).then(() => {
        globalState.events.emit('refresh-view', 'readlater');
      });
    }),
    commands.registerCommand('blog.viewerByMarkdown', (url, title) => {
      viewBlogByMarkdown('文章列表', url);
    }),
    commands.registerCommand('blog.viewer', (url, title) => {
      viewBlogByIframe(title, url);
    }),
    commands.registerCommand('mark.delete', ({ id }) => {
      BaseConfig.removeConfig('frontend-box.markbook', id).then(() => {
        globalState.events.emit('refresh-view', 'mark');
      });
    }),
    commands.registerCommand('mark.add', (title, url) => {
      window
        .showInputBox({
          placeHolder: '粘贴收藏网址URL',
        })
        .then((url: any) => {
          if (!url) {
            return;
          }
          if (!isRemoteLink(url)) {
            window.showErrorMessage('添加失败，URL 必须是 http 或 https 开头');
            return;
          }
          fetch(url).then((res) => {
            const matcher = res.match(/<title>([\S\s]*?)<\/title>/);
            const title = matcher[1];
            BaseConfig.updateConfig('frontend-box.markbook', [
              { title, url },
            ]).then(() => {
              globalState.events.emit('refresh-view', 'mark');
            });
          });
        });
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
