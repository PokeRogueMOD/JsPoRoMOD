HACK.battleskip.currentScene.gameData
    .saveAll(HACK.battleskip.currentScene, true, true, true)
    .then((success) => {
        if (!success) {
            return HACK.battleskip.currentScene.reset(true);
        }
        HACK.battleskip.currentScene.gameData
            .tryClearSession(
                HACK.battleskip.currentScene,
                HACK.battleskip.currentScene.sessionSlotId
            )
            .then((success) => {
                if (!success[0]) {
                    return HACK.battleskip.currentScene.reset(true);
                }
                HACK.battleskip.currentScene.reset();
                HACK.battleskip.currentScene.unshiftPhase(
                    new TitlePhase(this.scene)
                );
                HACK.battleskip.currentPhase.end();
            });
    });
