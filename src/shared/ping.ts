const { ping } = require('tcp-ping-node');
import { window } from "vscode";
import globalState from "../globalState";

export async function pingGithubRaw() {
    const githubRawHost = 'raw.githubusercontent.com'
    const options = { host: githubRawHost, port: '80', timeout: 6000 };

    const result = await ping(options);
    if (result.success) {
        globalState.GIT_RAW_HOST = githubRawHost;
    } else {
        window.showWarningMessage(`检测到您当前网络访问 ${githubRawHost} 超时，已切换为 ${globalState.fastGitHost}`);
    }
    return globalState.GIT_RAW_HOST;
}

