const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function replaceBlank(str,target) {
  return str.replace(/\s/g, target)
}
function isStringValid(str) {
  const result = str !== null && str !== undefined && str.trim() !== ''
  console.log('isStringValid'+result)
  return result;
}

function extractIdFromUrl(url){
  const regex = /id=(\d+)/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  } else {
    return isNumericString(url);
  }
}

function isNumericString(str) {
  const isStr = /^\d+$/.test(str);
  if(isStr){
    return str
  }else{
    return undefined
  }

}

module.exports = {
  replaceBlank:replaceBlank,
  formatNumber:formatNumber,
  extractIdFromUrl:extractIdFromUrl,
  isStringValid:isStringValid
}
