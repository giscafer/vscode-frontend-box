// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import { commands, ExtensionContext, window } from 'vscode';
import { BrowserViewWindowManager } from './browser/BrowserViewWindowManager';
import { Telemetry } from './browser/telemetry';
import globalState from './globalState';
import { BlogProvider } from './view/blogProvider';
import { viewBlogByIframe, viewBlogByMarkdown } from './webview/blog';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "frontend-box" is now active!');
  globalState.extensionContext = context;

  const blogNodeProvider = new BlogProvider();
  const blogView = window.createTreeView('view.blog', {
    treeDataProvider: blogNodeProvider,
  });
  blogNodeProvider.refresh();

  //  内置浏览器
  const telemetry = new Telemetry();

  const windowManager = new BrowserViewWindowManager(
    context.extensionPath,
    telemetry
  );

  telemetry.sendEvent('activate');

  context.subscriptions.push(
    commands.registerCommand('frontend-box.openPreview', (title, url?) => {
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

  context.subscriptions.push(
    commands.registerCommand('blog.viewerByMarkdown', (title, url) => {
      viewBlogByMarkdown('文章列表', url);
    }),
    commands.registerCommand('blog.viewer', (title, url) => {
      viewBlogByIframe(title, url);
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
