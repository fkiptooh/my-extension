import { tabs } from "webextension-polyfill";

// useful when keeping track of various amazon product pages;
export const getCurrentTab = async () => {
    const list = await tabs.query({ active: true, currentWindow: true });

    return list[0];
}