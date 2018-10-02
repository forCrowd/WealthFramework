
/**
 * QRCode.Js
 * https://github.com/davidshimjs/qrcodejs.git
 *
 * @param string projectId
 */
function makingQRCode(projectId) {
  var e = document.getElementById("qrcode");
  new QRCode(e, {
    text: "https://wealth.forcrowd.org/project/" + projectId,
    width: 64,
    height: 64,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
}
