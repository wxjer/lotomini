// api.js

// const BASE_URL = 'https://lotoserver.5bug.cn';
const BASE_URL = 'http://127.0.0.1:8787';
const CDN_BASE_URL = 'https://img2.5bug.cn';
const MUSIC_163_SONG_URL = 'orpheus://song/';
const MUSIC_163_LIST_URL = 'orpheus://playlist/';
const PUSH_BASE_URL = 'https://bark.5bug.cn/';
const BASE = {

}
const API_URLS = {
  getUserLogin:`${BASE_URL}/api/login`,
  getUpyunSinature:`${BASE_URL}/api/getSignatureUrl`,
  createUser:`${BASE_URL}/api/users`,
  getUserProfile:`${BASE_URL}/api/users/getUser`,
  updateUser:`${BASE_URL}/api/users/updateUser`,
  deleteUser:`${BASE_URL}/api/users/deleteUser`,
  addPhoto:`${BASE_URL}/api/albums/addPhoto`,
  getAllPhotos:`${BASE_URL}/api/albums/getAllPhotos`,
  deletePhoto:`${BASE_URL}/api/albums/deletePhoto`,
  deletePhotos:`${BASE_URL}/api/albums/deletePhotos`,
  sendPush:`${BASE_URL}/api/push/send`,
  savePushPlan:`${BASE_URL}/api/push/save`,
  deletePushPlan:`${BASE_URL}/api/push/delete`
};

const STORAGE_TAG = {
    openId:'openid',
    nickName:'nickname',
    avatar:'avatar',
    pushKeyJson:'pushKeyJson',
    config:'config',
    photosJson:'photosJson'
}

module.exports = {
  API_URLS:API_URLS,
  CDN_BASE_URL:CDN_BASE_URL,
  BASE_URL:BASE_URL,
  MUSIC_163_SONG_URL:MUSIC_163_SONG_URL,
  MUSIC_163_LIST_URL:MUSIC_163_LIST_URL,
  BASE:BASE,
  STORAGE_TAG:STORAGE_TAG,
  PUSH_BASE_URL:PUSH_BASE_URL,
}
