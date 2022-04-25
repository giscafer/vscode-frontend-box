import { join } from 'path';
import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { getBlogList } from '../shared/constant';
import globalState from '../globalState';

export class BlogProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
  private blogList: any[] = [];
  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

  constructor() {
    getBlogList().then(list => this.blogList = list);
  }

  refresh(): any {
    this._onDidChangeTreeData.fire(undefined);
  }

  getChildren(): TreeItem[] | Thenable<TreeItem[]> {
    return this.blogList.map((item) => {
      const { title, description, url, command, icon, id } = item;
      const tree = new TreeItem(title, TreeItemCollapsibleState.None);
      tree.command = {
        title,
        command,
        arguments: [url, title],
      };
      tree.id = id;
      tree.tooltip = description;
      tree.iconPath = globalState.extensionContext?.asAbsolutePath(
        join('resources', `${icon}.svg`),
      );
      return tree;
    });
  }

  getParent(element: TreeItem): TreeItem | null {
    return null;
  }

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }
}
