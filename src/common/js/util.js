/**
 *解析URL参数
 *@export ?id=12345&a=b
 *@return object {id:12345,a:b}
 */
export function urlParse() {
  // 拿到参数字符串
  let url = window.location.search;
  let obj = {};
  // 正则表达式：[?&]包含问号或者&，[^?&]所有非问号和&的字符+一个或多个=[^?&]所有非问号和&的字符+一个或多个
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach((item) => {
      // item.substring(1)删除第一个字符，split('=')用等号分割
      let temArr = item.substring(1).split('=');
      // decodeURIComponent()因为是url参数
      let key = decodeURIComponent(temArr[0]);
      let val = decodeURIComponent(temArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
