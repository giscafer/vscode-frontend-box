export interface SiteType {
  title: string;
  url: string;
  id: string;
}

export const BLOG_CATEGORY = [
  {
    id: 'ferss',
    title: 'Front-End RSS',
    description:
      '前端早读课、前端大全、前端之巅、淘宝前端、张鑫旭博客、凹凸实验室',
    command: 'frontend-box.openPreview',
    url: 'https://front-end-rss.now.sh',
    icon: 'rss',
  },
  {
    id: 'leerob',
    title: 'Lee Robinson',
    description:
      'Helping developers build a faster web. Teaching about web development, serverless, and React / Next.js',
    command: 'frontend-box.openPreview',
    url: 'https://leerob.io/blog',
    icon: 'blog',
  },
  {
    id: 'zdk',
    title: '前端早读课',
    description: '前端早读课公众号',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/前端早读课.md',
    icon: 'wechat',
  },
  {
    id: 'qddq',
    title: '前端大全',
    description: '前端大全公众号',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/前端大全.md',
    icon: 'wechat',
  },
  {
    id: 'qdzd',
    title: '前端之巅',
    description: '前端之巅公众号',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/前端之巅.md',
    icon: 'wechat',
  },
  {
    id: 'ryf',
    title: '阮一峰的网络日志',
    description: '阮一峰的网络日志',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/阮一峰的网络日志.md',
    icon: 'blog',
  },
  {
    id: 'zxx',
    title: '张鑫旭博客',
    description: '张鑫旭博客',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/张鑫旭-鑫空间-鑫生活.md',
    icon: 'blog',
  },
  {
    id: 'taobao',
    title: 'Taobao-FED-|-淘宝前端团队',
    description: '淘宝前端盒子',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/Taobao-FED-|-淘宝前端团队.md',
    icon: 'blog',
  },
  {
    id: 'aoto',
    title: 'Aotu-|-凹凸实验室',
    description: '凹凸实验室博客',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/Aotu-|-凹凸实验室.md',
    icon: 'blog',
  },
  {
    id: 'jdc',
    title: 'JDC-|-京东设计中心',
    description: 'JDC-|-京东设计中心',
    command: 'blog.viewerByMarkdown',
    url:
      'https://raw.sevencdn.com/ChanceYu/front-end-rss/master/details/JDC-|-京东设计中心.md',
    icon: 'blog',
  },
];
