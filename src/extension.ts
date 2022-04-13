// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { commands, ExtensionContext, window } from 'vscode';
import { BaseConfig } from './BaseConfig';
import { BrowserViewWindowManager } from './browser/BrowserViewWindowManager';
import { Telemetry } from './browser/telemetry';
import globalState from './globalState';
import { initConfig } from './initConfig';
import { fetch, isRemoteLink, uniqueAlphaNumericId } from './utils';
import { BlogProvider } from './view/blogProvider';
import { bookMarkProvider } from './view/markProvider';
import { readLaterProvider } from './view/readLaterProvider';
import { viewBlogByIframe, viewBlogByMarkdown } from './webview/blog';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "frontend-box" is now active!');
  globalState.extensionContext = context;
  // 初始化配置
  initConfig();
  // 实例化Provider
  const blogNodeProvider = new BlogProvider();
  const markNodeProvider = new bookMarkProvider();
  const readNodeProvider = new readLaterProvider();
  // 创建Tree视图
  const blogView = window.createTreeView('view.blog', {
    treeDataProvider: blogNodeProvider,
  });
  const markView = window.createTreeView('view.mark', {
    treeDataProvider: markNodeProvider,
  });
  const readLaterView = window.createTreeView('view.readLater', {
    treeDataProvider: readNodeProvider,
  });
  blogNodeProvider.refresh();
  markNodeProvider.refresh();
  readNodeProvider.refresh();

  //  内置浏览器
  const telemetry = new Telemetry();
  const disableToolBarList = BaseConfig.getConfig('frontend-box.disableToolBar',[])

  const windowManager = new BrowserViewWindowManager(
    context.extensionPath,
    telemetry,
    disableToolBarList
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
    }),
  );

  globalState.events.addListener('refresh-view', (type) => {
    if (type === 'mark' && markView.visible) {
      markNodeProvider.refresh();
    } else if (type === 'blog' && blogView.visible) {
      blogNodeProvider.refresh();
    } else if (type === 'readLater' && readLaterView.visible) {
      readNodeProvider.refresh();
    }
  });

  context.subscriptions.push(
    commands.registerCommand('readLater.add', (url, title) => {
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
            BaseConfig.updateConfig('frontend-box.readLater', [
              { title, url, id: uniqueAlphaNumericId() },
            ]).then(() => {
              globalState.events.emit('refresh-view', 'readLater');
            });
          });
        });
    }),
    commands.registerCommand('readLater.delete', ({ id }) => {
      BaseConfig.removeConfig('frontend-box.readLater', id).then(() => {
        globalState.events.emit('refresh-view', 'readLater');
      });
    }),
    commands.registerCommand('blog.viewerByMarkdown', (url, title) => {
      viewBlogByMarkdown('文章列表', url);
    }),
    commands.registerCommand('blog.viewer', (url, title) => {
      viewBlogByIframe(title, url);
    }),
    commands.registerCommand('mark.delete', ({ id }) => {
      BaseConfig.removeConfig('frontend-box.bookMark', id).then(() => {
        globalState.events.emit('refresh-view', 'mark');
      });
    }),
    commands.registerCommand('readLater.edit', ({ id }) => {
      const markData = BaseConfig.getConfig('frontend-box.readLater');
      window
        .showInputBox({
          placeHolder: '请输入标题',
        })
        .then((txt: any) => {
          if (!txt) {
            return;
          }
          if (!txt) {
            window.showErrorMessage('不能为空');
            return;
          }
          markData.map((item: any) => {
            if (item.id === id) {
              item.title = txt;
            }
          });
          BaseConfig.setConfig('frontend-box.readLater', markData).then(() => {
            globalState.events.emit('refresh-view', 'readLater');
          });
        });
    }),
    commands.registerCommand('mark.edit', ({ id }) => {
      const markData = BaseConfig.getConfig('frontend-box.bookMark');
      window
        .showInputBox({
          placeHolder: '请输入标题',
        })
        .then((txt: any) => {
          if (!txt) {
            return;
          }
          if (!txt) {
            window.showErrorMessage('不能为空');
            return;
          }
          markData.map((item: any) => {
            if (item.id === id) {
              item.title = txt;
            }
          });
          BaseConfig.setConfig('frontend-box.bookMark', markData).then(() => {
            globalState.events.emit('refresh-view', 'mark');
          });
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
            BaseConfig.updateConfig('frontend-box.bookMark', [
              { title, url, id: uniqueAlphaNumericId() },
            ]).then(() => {
              globalState.events.emit('refresh-view', 'mark');
            });
          });
        });
    }),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
