import dayjs from 'dayjs';
dayjs.locale('zh-cn')

export function setStorage(data, expiration) {
    let expirationTime = dayjs().add(expiration.split(".")[0], expiration.split(".")[1]).format('YYYY-MM-DD HH:mm:ss')
    let storageValue = {
        data,
        expirationTime
    }
    // console.log(storageValue);
    try {
        wx.setStorageSync('user_code', JSON.stringify(storageValue));
    } catch (e) {
        console.log(e);
    }
}

export function getStorage(storageKey) {
    try {
        let rawData = JSON.parse(wx.getStorageSync(storageKey));
        // console.log(dayjs().isBefore(dayjs(rawData.expirationTime)));
        if (rawData && dayjs().isBefore(dayjs(rawData.expirationTime))) {
            // 当前时间在过期时间之前，返回数据
            return rawData.data;
        }else{
            return false;
        }
    } catch (e) {
        console.log(e)
    }
}

