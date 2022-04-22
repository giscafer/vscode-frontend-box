import { ExtensionContext } from 'vscode';
import { EventEmitter } from 'events';

let extensionContext: ExtensionContext = (undefined as unknown) as ExtensionContext;
let events = new EventEmitter();

// git url 连接host
const fastGitHost = 'raw.fastgit.org';
let GIT_RAW_HOST = fastGitHost;

export default {
  extensionContext,
  events,
  GIT_RAW_HOST,
  fastGitHost,
};
