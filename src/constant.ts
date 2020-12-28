export interface SiteType {
  title: string;
  url: string;
}

export const BLOG_CATEGORY = [
  {
    title: 'Front-End RSS',
    description:
      '前端早读课、前端大全、前端之巅、淘宝前端、张鑫旭博客、凹凸实验室',
    command: 'frontend-box.openPreview',
    url: 'https://front-end-rss.now.sh',
    icon: 'rss',
  },
  {
    title: '前端早读课',
    description: '前端早读课公众号',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/前端早读课.md',
    icon: 'wechat',
  },
  {
    title: '前端大全',
    description: '前端大全公众号',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/前端大全.md',
    icon: 'wechat',
  },
  {
    title: '前端之巅',
    description: '前端之巅公众号',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/前端之巅.md',
    icon: 'wechat',
  },
  {
    title: '阮一峰的网络日志',
    description: '阮一峰的网络日志',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/阮一峰的网络日志.md',
    icon: 'blog',
  },
  {
    title: '张鑫旭博客',
    description: '张鑫旭博客',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/张鑫旭-鑫空间-鑫生活.md',
    icon: 'blog',
  },
  {
    title: 'Taobao-FED-|-淘宝前端团队',
    description: '淘宝前端盒子',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/Taobao-FED-|-淘宝前端团队.md',
    icon: 'blog',
  },
  {
    title: 'Aotu-|-凹凸实验室',
    description: '凹凸实验室博客',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/Aotu-|-凹凸实验室.md',
    icon: 'blog',
  },
  {
    title: 'JDC-|-京东设计中心',
    description: 'JDC-|-京东设计中心',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/JDC-|-京东设计中心.md',
    icon: 'blog',
  },
];
