import { ColorSchemeName } from 'react-native-appearance';
export declare type DevMenuSettingsType = {
    preferredAppearance?: ColorSchemeName;
    motionGestureEnabled?: boolean;
    touchGestureEnabled?: boolean;
};
export declare function getSettingsAsync(): Promise<DevMenuSettingsType>;
export declare function updateSettingsAsync(): Promise<void>;
export declare function closeMenuAsync(): Promise<any>;
