import { BaseScene } from './baseScene.js';
import { showToast } from '../utils/showToast.js';

export class AccountDataManager extends BaseScene {
    constructor() {
        super();
    }

    async exportAccountData() {
        try {
            // Fetch the system save data and sessions
            const systemSaveData = this.currentScene.gameData.getSystemSaveData();

            const sessionPromises = [];
            for (let i = 0; i < 5; i++) {
                sessionPromises.push(this.currentScene.gameData.getSession(i));
            }

            const sessions = await Promise.all(sessionPromises);

            // Create the JSON object
            const data = {
                trainer: systemSaveData,
                sessions: sessions
            };

            // Convert the JSON object to a string
            const jsonData = JSON.stringify(data, (k, v) => (typeof v === 'bigint' ? v.toString() : v), 2);

            // Create a blob from the JSON string
            const blob = new Blob([jsonData], { type: 'application/json' });

            // Create a link element and trigger a download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'data.json';
            document.body.appendChild(link);
            link.click();

            // Clean up the link element
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            showToast('Account data exported successfully!');
        } catch (error) {
            showToast('Failed to export account data!');
            console.error(error);
        }
    }

    async importAccountData(file) {
        try {
            const fileContent = await file.text();
            const data = JSON.parse(fileContent);

            // Assuming the data format is as follows:
            // {
            //     trainer: systemSaveData,
            //     sessions: [session0, session1, ..., session4]
            // }

            this.currentScene.gameData.setSystemSaveData(data.trainer);

            for (let i = 0; i < data.sessions.length; i++) {
                this.currentScene.gameData.setSession(i, data.sessions[i]);
            }

            this.save();

            showToast('Account data imported successfully!');
        } catch (error) {
            showToast('Failed to import account data!');
            console.error(error);
        }
    }

    save() {
        this.currentScene.gameData.saveSystem(); // Ensure your save system method is correctly referenced
    }
}