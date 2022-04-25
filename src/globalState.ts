import { ExtensionContext } from 'vscode';
import { EventEmitter } from 'events';

interface ConfigState {
  enableNotification?: boolean,
  disableToolBar?: string[],
  readLater?: any[],
  bookMark?: any[]
}

function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}

let extensionContext: ExtensionContext = (undefined as unknown) as ExtensionContext;
let events = new EventEmitter();

// git url 连接host
const fastGitHost = 'raw.fastgit.org';
let GIT_RAW_HOST = fastGitHost;

const configState = {
  state: {
    "enableNotification": true,
  } as ConfigState,
  setSate(key: string, value: any) {
    return Object.defineProperty(this.state, key, { value });
  },
  getState(key: string) {
    return isValidKey(key, this) ? this.state[key] : null;
  }
}

export default {
  extensionContext,
  events,
  GIT_RAW_HOST,
  fastGitHost,
  configState
};
