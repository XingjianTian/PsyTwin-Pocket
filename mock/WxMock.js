/* eslint-disable */
var __request = wx.request;

function createGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function replaceGuidChar(char) {
    var random = Math.floor(Math.random() * 16);
    var value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function materializeTemplate(value) {
  if (value === '@guid()') return createGuid();
  if (Array.isArray(value)) return value.map(materializeTemplate);
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce(function buildObject(result, key) {
      result[key] = materializeTemplate(value[key]);
      return result;
    }, {});
  }
  return value;
}

var Mock = {
  _mocked: {},
  mock: function mock(pathOrTemplate, template) {
    if (arguments.length > 1) {
      this._mocked[pathOrTemplate] = { template: template };
      return template;
    }
    return materializeTemplate(pathOrTemplate);
  },
};

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
