import { NativeModules } from 'react-native';
import { NativeModulesProxy } from '@unimodules/core';
const ExpoDevSupportInternal = NativeModules.ExpoDevSupportInternal;
// Mock ExpoFontLoader unimodule - we don't have access to unimodules from dev support app.
if (!NativeModulesProxy.ExpoFontLoader) {
    NativeModulesProxy.ExpoFontLoader = {
        addListener() { },
        removeListeners() { },
        async loadAsync(...args) {
            return ExpoDevSupportInternal.loadFontAsync(...args);
        },
    };
}
export async function getSettingsAsync() {
    return {
        preferredAppearance: 'dark',
        motionGestureEnabled: true,
        touchGestureEnabled: true,
    };
}
export async function updateSettingsAsync() { }
export async function closeMenuAsync() {
    return ExpoDevSupportInternal.closeMenuAsync();
}
//# sourceMappingURL=DevSupportInternal.js.map