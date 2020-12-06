// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { commands, ExtensionContext, window } from 'vscode';
import { BaseConfig } from './BaseConfig';
import { BrowserViewWindowManager } from './browser/BrowserViewWindowManager';
import { Telemetry } from './browser/telemetry';
import globalState from './globalState';
import { BlogProvider } from './view/blogProvider';
import { MarkbookProvider } from './view/markProvider';
import { viewBlogByIframe, viewBlogByMarkdown } from './webview/blog';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "frontend-box" is now active!');
  globalState.extensionContext = context;

  const blogNodeProvider = new BlogProvider();
  const markNodeProvider = new MarkbookProvider();
  const blogView = window.createTreeView('view.blog', {
    treeDataProvider: blogNodeProvider,
  });
  const markView = window.createTreeView('view.mark', {
    treeDataProvider: markNodeProvider,
  });
  blogNodeProvider.refresh();
  markNodeProvider.refresh();

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
    if (type === 'mark') {
      markNodeProvider.refresh();
    } else if (type === 'blog') {
      blogNodeProvider.refresh();
    }
  });

  context.subscriptions.push(
    commands.registerCommand('blog.viewerByMarkdown', (title, url) => {
      viewBlogByMarkdown('文章列表', url);
    }),
    commands.registerCommand('blog.viewer', (title, url) => {
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
          placeHolder: '第一步：输入名称',
        })
        .then((title: any) => {
          if (!title) {
            return;
          }
          console.log(title);
          window
            .showInputBox({
              placeHolder: '第二步：填写网址url',
            })
            .then((url: any) => {
              console.log(url);
              if (!url) {
                return;
              }
              if (/^(http|https)/.test(url) !== true) {
                window.showErrorMessage(
                  '添加失败，URL 必须是 http 或 https 开头'
                );
                return;
              }
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
