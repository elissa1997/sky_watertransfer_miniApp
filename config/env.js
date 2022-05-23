export function getEnv() {
    let res = wx.getSystemInfoSync();
    // 客户端中host有值，本地开发的时候host为null
    if (res.host) {
      return 'pro';
    } else {
      return 'dev';
    }
}