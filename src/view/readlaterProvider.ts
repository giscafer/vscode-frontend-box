import { join } from 'path';
import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import { BaseConfig } from '../BaseConfig';
import { SiteType } from '../constant';
import globalState from '../globalState';

export class ReadLaterProvider implements TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();

  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): any {
    this._onDidChangeTreeData.fire(undefined);
  }

  getChildren(): TreeItem[] | Thenable<TreeItem[]> {
    const sites = BaseConfig.getConfig('frontend-box.readlater');
    return sites.map((item: SiteType) => {
      const { title, url } = item;
      const tree = new TreeItem(title, TreeItemCollapsibleState.None);
      tree.command = {
        title,
        command: 'frontend-box.openPreview',
        arguments: [url],
      };
      tree.id = url;
      tree.tooltip = url;
      tree.iconPath = globalState.extensionContext?.asAbsolutePath(
        join('resources', `arcticle.svg`)
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
