/* eslint-disable */
var __request = wx.request;
var Mock = require('./mock.js');

console.log('[WxMock] wx.request override installed');

wx.request = function (config) {
  console.log('[WxMock] Intercepted request:', config.url);
  console.log('[WxMock] Request method:', config.method);
  console.log('[WxMock] Request data:', config.data);

  // 提取路径部分（移除域名和 query string）
  var fullUrl = config.url.split('?')[0];
  var url = fullUrl.replace(/^https?:\/\/[^\/]+/, '');
  if (!url) url = fullUrl;
  console.log('[WxMock] Looking up mock for path:', url);
  console.log('[WxMock] Mock._mocked keys:', Object.keys(Mock._mocked));

  if (typeof Mock._mocked[url] == 'undefined') {
    console.log('[WxMock] No mock found for:', url, 'in keys:', Object.keys(Mock._mocked));
    console.log('[WxMock] Passing to real request');
    __request(config);
    return;
  }

  console.log('[WxMock] Mock found for:', url);
  var resTemplate = Mock._mocked[url].template;
  var response;

  // 模拟 req.data 从 query params 中获取
  var query = {};
  var queryString = config.url.split('?')[1];
  if (queryString) {
    queryString.split('&').forEach(function (item) {
      var pair = item.split('=');
      query[pair[0]] = pair[1];
    });
  }

  // 合并 body data
  var reqData = Object.assign({}, query, config.data);
  console.log('[WxMock] reqData:', reqData);

  if (typeof resTemplate === 'function') {
    console.log('[WxMock] resTemplate is function');
    response = resTemplate({ data: reqData });
  } else {
    console.log('[WxMock] resTemplate is object/template');
    response = Mock.mock(resTemplate);
  }

  console.log('[WxMock] Generated response:', response);

  if (typeof config.success == 'function') {
    config.success(response);
  }
  if (typeof config.complete == 'function') {
    config.complete(response);
  }
};

module.exports = Mock;
