// pages/login.js
import Notify from '@vant/weapp/notify/notify';
import WxmpRsa from 'wxmp-rsa'
import { setStorage, getStorage } from '../../utils/storage.js';
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

    // cas登录
    login() {
        wx.request({
            url: config.BASE_URL+'casProxy/loginToken', //cas接口
            // url: 'http://10.34.192.18:8686/casProxy/', //cas接口
            method: 'POST',
            data: {
                username: this.data.username,
                password: this.encryptedData(this.data.password) //RSA加密
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
                } else {
                    Notify({
                        type: 'warning',
                        message: '用户名或密码错误'
                    });
                }
                //   console.log(res)
            }
        })
    },

    // 输入框重置
    reset() {
        this.setData({
            username: "",
            password: ""
        })
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

    // 获取code
    getCode() {
        let _this = this;
        wx.login({
            success(res) {
                console.log("获取code: "+res);
                _this.getOpenID(res.code)
            }
        })
    },

    // 获取OpenID
    getOpenID(code) {
        let _this = this;

        wx.request({
            url: 'https://www.skywatercloud.com/wxProxy/sns/jscode2session', //微信反代接口
            method: 'get',
            data: {
                js_code: code,
            },
            success(res) {
                console.log("获取openid: "+res);
                if (res.statusCode === 200) {
                    _this.setData({
                        openid: res.data.openid
                    })
                } else {
                    Notify({
                        type: 'warning',
                        message: '接口错误'
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
                console.log("openid登录: "+res);
                console.log(res);
                if (res.statusCode === 200) {
                    let token = res.data;
                    wx.navigateTo({
                        url: '/pages/webview/webview?token=' + token,
                    })
                } else if(res.statusCode === 500){ 

                    wx.redirectTo({
                        url: '/pages/bind/bind?openid='+_this.data.openid,
                      })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(config);
        this.getCode();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})