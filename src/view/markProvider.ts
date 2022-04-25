import { join } from 'path';
import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { BaseConfig } from '../BaseConfig';
import { SiteType } from '../shared/constant';
import globalState from '../globalState';
import { uniqueAlphaNumericId } from '../utils';

export class BookMarkProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();

  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): any {
    this._onDidChangeTreeData.fire(undefined);
  }

  getChildren(): TreeItem[] | Thenable<TreeItem[]> {
    const sites = BaseConfig.getConfig('frontend-box.bookMark');
    return sites.map((item: SiteType) => {
      const { title, url, id } = item;
      const tree = new TreeItem(title, TreeItemCollapsibleState.None);
      tree.command = {
        title,
        command: 'frontend-box.openPreview',
        arguments: [url],
      };
      tree.id = id;
      tree.tooltip = url;
      tree.iconPath = globalState.extensionContext?.asAbsolutePath(
        join('resources', `sitepage.svg`),
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
