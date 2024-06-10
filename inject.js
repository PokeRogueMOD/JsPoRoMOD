(function() {
    var script = document.createElement('script');
    script.src = 'https://raw.githack.com/PokeRogueMOD/JsPoRoMOD/main/js-poro-mod/mod.min.js';
    script.type = 'text/javascript';
    script.onload = () => {
        console.log('PokeRogueMOD loaded.');
        if (typeof PokeRogueMOD !== 'undefined' && PokeRogueMOD.startPopup) {
            PokeRogueMOD.startPopup();
        } else {
            console.error('PokeRogueMOD.startPopup is not defined.');
        }
    };
    script.onerror = () => console.error('Failed to load PokeRogueMOD.');
    document.head.appendChild(script);
})();