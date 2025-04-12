import { readFileSync } from 'fs';
import { pathToFileURL } from 'url';
import Properties from '../../core/Properties';

export function getApplyThemeTemplate() {
    const template = readFileSync(__dirname + '/apply-theme.js', 'utf8');
    const themeBaseURL = pathToFileURL(Properties.themesPath).toString();

    return template.replace("{{ themesPath }}", themeBaseURL);
}
