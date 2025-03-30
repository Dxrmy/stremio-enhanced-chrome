import { marked } from "marked";
import { readFileSync } from "fs";
import Updater from "../../core/Updater";

export async function getUpdateModalTemplate() {
    let template = readFileSync(__dirname + '/update-modal.html', 'utf8');
    let releaseNotes = await Updater.getReleaseNotes();
    let markdown = await marked(releaseNotes, { gfm: true, breaks: true });

    let currentVersion = Updater.getCurrentVersion();
    let latestVersion = await Updater.getLatestVersion();

    return template
        .replace("{{ releaseNotes }}", markdown)
        .replace("{{ currentVersion }}", currentVersion)
        .replace("{{ newVersion }}", latestVersion)
        .replace("{{ newVersion }}", latestVersion);
}