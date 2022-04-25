import { BaseConfig } from './BaseConfig';
import { uniqueAlphaNumericId } from './utils';
import globalState from "./globalState";

// 数据结构发生变化，兼容升级
function reSetConfig(configKey: string) {
  const config = BaseConfig.getConfig(configKey);
  if (configKey === 'frontend-box.enableNotification') {
    globalState.configState.setSate('enableNotification', config);
    return;
  }

  config.map((item: any) => {
    // 未设定，则自动添加ID
    if (typeof item === 'object' && !item.id) {
      item.id = uniqueAlphaNumericId();
    }
  });

  // 更新配置文件
  BaseConfig.setConfig(configKey, config);
}

export function initConfig() {
  // 更新 bookMark
  reSetConfig('frontend-box.bookMark');
  // 更新 readLater
  reSetConfig('frontend-box.readLater');
  // 更新 disableToolBar
  reSetConfig('frontend-box.disableToolBar');
  // 更新 enableNotification
  reSetConfig('frontend-box.enableNotification');
}
