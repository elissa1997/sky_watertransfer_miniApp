// pages/bind.js
import Notify from '@vant/weapp/notify/notify';
import WxmpRsa from 'wxmp-rsa'
import config from '../../config/index.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        password: "",
        openid: ""
    },
    // RSA加密
    encryptedData(data) {
        const publicKey =
            `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDR4I4x8KJwt959Eq9T26c2QLf
        0wAHRZDl1Kn6YIJRd+2wNJTNawa8wm9+wpFAC2BiNQKoUtt/eZo55hoWUPL35OFPm
        FaeNh5/S79VqzvgVTgeFAa3Rz9Af4vVMlQUKGgID6lFxTAC+dZg7Xmt7xVvBq8hHU
        y5FbGhykju6Q3W1wIDAQAB`;

        // 新建JSEncrypt对象
        let encryptor = new WxmpRsa();
        // 设置公钥
        encryptor.setPublicKey(publicKey);
        // 加密数据
        return encryptor.encryptLong(data);
    },

    // 绑定微信号
    bindCasAndWx(){
        let _this = this;
        wx.request({
            url: config.BASE_URL+'casProxy/bind4wx', //cas接口
            method: 'POST',
            data: {
                username: this.data.username,
                password: this.encryptedData(this.data.password), //RSA加密
                openid: this.encryptedData(this.data.openid)
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
                if (res.data === 'bind success') {
                    _this.tryWxAuth();
                }else{
                    Notify({
                        type: 'warning',
                        message: '绑定失败'
                    });
                }
            }
        })
    },

    // 尝试使用openid登录
    tryWxAuth() {
        let _this = this;

        wx.request({
            url: config.BASE_URL+'casProxy/auth4wx', //cas接口
            method: 'POST',
            data: {
                openid: _this.encryptedData(_this.data.openid),
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success(res) {
                if (res.statusCode === 200) {
                    let token = res.data;
                    wx.navigateTo({
                        url: '/pages/webview/webview?token=' + token,
                    })
                } else if(res.statusCode === 500){ 
                    Notify({
                        type: 'warning',
                        message: '登录失败'
                    });
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            openid: options.openid
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})