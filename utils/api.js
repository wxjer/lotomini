// api.js

// const BASE_URL = 'https://lotoserver.5bug.cn';
const BASE_URL = 'http://localhost:8787';
const CDN_BASE_URL = 'https://img2.5bug.cn';
const MUSIC_163_SONG_URL = 'orpheus://song/';
const MUSIC_163_LIST_URL = 'orpheus://playlist/';
const BASE = {

}
const API_URLS = {
  getUserLogin:`${BASE_URL}/api/login`,
  getUpyunSinature:`${BASE_URL}/api/getSignatureUrl`
  // 添加其他请求URL...
};

const STORAGE_TAG = {
    openId:'openid',
    nickName:'nickname',
    avatar:'avatar',
    pushKey:'pushKey'
}

module.exports = {
  API_URLS:API_URLS,
  CDN_BASE_URL:CDN_BASE_URL,
  BASE_URL:BASE_URL,
  MUSIC_163_SONG_URL:MUSIC_163_SONG_URL,
  MUSIC_163_LIST_URL:MUSIC_163_LIST_URL,
  BASE:BASE,
  STORAGE_TAG:STORAGE_TAG,
}
