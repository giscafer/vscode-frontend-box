import { BaseConfig } from './BaseConfig';
import { uniqueAlphaNumericId } from './utils';

// 数据结构发生变化，兼容升级
function reSetConfig(configKey:string){
  const config = BaseConfig.getConfig(configKey);
  config.map((item: any) => {
    // 未设定，则自动添加ID
    if (!item.id) {
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
}
