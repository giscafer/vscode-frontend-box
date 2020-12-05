import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { BLOG_CATEGORY } from '../constant';

export class BlogProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();

  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): any {
    this._onDidChangeTreeData.fire(undefined);
  }

  getChildren(): TreeItem[] | Thenable<TreeItem[]> {
    return BLOG_CATEGORY.map((item) => {
      const { title, description, url, command, id } = item;
      const tree = new TreeItem(title, TreeItemCollapsibleState.None);
      tree.command = {
        title,
        command,
        arguments: [id, url],
      };
      tree.tooltip = description;
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
