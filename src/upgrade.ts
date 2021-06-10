import { BaseConfig } from './BaseConfig';
import { uniqueAlphaNumericId } from './utils';

// 数据结构发生变化，兼容升级
export function upgrade() {
  const markbook = BaseConfig.getConfig('frontend-box.markbook');
  let hasNoneId = false;
  markbook.map((item: any) => {
    if (!item.id) {
      hasNoneId = true;
      item.id = uniqueAlphaNumericId();
    }
  });
  BaseConfig.setConfig('frontend-box.markbook', markbook);
  hasNoneId = false;
  const readlater = BaseConfig.getConfig('frontend-box.readlater');
  readlater.map((item: any) => {
    if (!item.id) {
      hasNoneId = true;
      item.id = uniqueAlphaNumericId();
    }
  });
  BaseConfig.setConfig('frontend-box.readlater', readlater);
}
