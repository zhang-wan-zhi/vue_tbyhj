import CryptoJS from 'crypto-js'
export default {
  encrypt2(plaintText) {
    var plaintText =CryptoJS.enc.Utf8.parse(plaintText);
    var options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    };
    console.log(CryptoJS.enc.Utf8)
    var key = CryptoJS.enc.Utf8.parse("qwertyuiqwertyui");
    var encryptedData = CryptoJS.AES.encrypt( plaintText,key, options);
    var encryptedBase64Str = encryptedData.toString();
    return encryptedBase64Str;
  },
}