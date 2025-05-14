
/**
 * 
 * @param {string} reqUrl 
 * @returns {boolean}
 */
function isCustom(reqUrl) {
  return iDontLikeThisUrl.some(url => reqUrl.includes(url));
}

export const iDontLikeThisUrl = ["pulse.walletconnect.org"];

const url = {
  isCustom,
  iDontLikeThisUrl,
}
export default url;