// inject.js
(function () {
    var myGlobalVarValue = window.Phaser;
    window.postMessage({ type: "FROM_PAGE", text: myGlobalVarValue }, "*");
})();
