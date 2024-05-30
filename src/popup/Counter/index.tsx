import { useEffect, useState } from "react";
import { getCurrentTab } from "../../helpers/tabs";
import { storage } from "webextension-polyfill";

export const Counter = () => {
    const [value, setValue] = useState(0);
    const [tabId, setTabId] = useState(0);

    useEffect(() => {
        const readBackgroundMessage = async () => {
            const tab = await getCurrentTab();
            const currentTabId = tab.id

            if (currentTabId) {
                const data = await storage.local.get(currentTabId.toString())
                const currentValue = data?.[currentTabId] ?? 0
                setValue(currentValue)
                setTabId(currentTabId);
            }
        }

        readBackgroundMessage();
    }, []);

    const incrementCounter = async () => {
        if (tabId) {
            const newValue = value + 1;
            setValue(newValue);
            await storage.local.set({ [tabId]: newValue });
        }
    };

    useEffect(() => {
        const handleStorageChange = async (changes: any) => {
            if (changes[tabId]) {
                const newValue = changes[tabId].newValue;
                setValue(newValue);
            }
        };

        storage.onChanged.addListener(handleStorageChange);
        return () => {
            storage.onChanged.removeListener(handleStorageChange);
        };
    }, [tabId]);

    return (
        <div style={{
            height: '100vh',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
            
        }}
        onClick={incrementCounter}
        >
            Clicks: { value }
        </div>
    )
}