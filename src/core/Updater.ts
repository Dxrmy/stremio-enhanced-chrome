import { readFileSync } from "fs";
//import { shell } from "electron";
import helpers from '../utils/Helpers';
import { getLogger } from "../utils/logger";
import { join } from "path";
import { getUpdateModalTemplate } from "../components/update-modal/updateModal";

class Updater {
    private static logger = getLogger("Updater");

    public static async checkForUpdates(noUpdatePrompt: boolean) {
        try {
            let latestVersion = await this.getLatestVersion();
            if(latestVersion > this.getCurrentVersion()) {
                // let updatePrompt = await helpers.showAlert("info", "Update Available", "An update is available. Open latest release page?", ["Yes", "No"]);
                // if(updatePrompt == 0) {
                //     shell.openExternal("https://github.com/REVENGE977/stremio-enhanced-community/releases/latest");
                //     return true;
                // }

                document.getElementsByClassName("modals-container")[0].innerHTML = await getUpdateModalTemplate();
            } else if(noUpdatePrompt) {
                await helpers.showAlert("info", "No update available!", "You seem to have the latest version.", ["OK"]);
                return false;
            }
        } catch(e) {
            this.logger.info(e);
            return false;
        }
    }

    public static async getLatestVersion() {
        const request = await fetch("https://github.com/REVENGE977/stremio-enhanced-community/raw/main/version");
        const response = await request.text();

        this.logger.info(`Latest version available is v${response}.`);
        return response;
    }

    public static getCurrentVersion() {
        const currentVersion = readFileSync(join(__dirname, "../", "../", "version"), "utf-8");
        return currentVersion;
    }

    public static async getReleaseNotes() {
        const request = await fetch("https://api.github.com/repos/REVENGE977/stremio-enhanced-community/releases/latest");
        const response = await request.json();

        const releaseNotes = response.body;
        return releaseNotes;
    }
}

export default Updater;