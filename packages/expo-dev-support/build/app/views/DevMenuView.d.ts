import React from 'react';
import { Context } from './DevMenuBottomSheetContext';
declare type Props = {
    task: {
        [key: string]: any;
    };
    uuid: string;
    devMenuItems: {
        [key: string]: any;
    };
    enableDevelopmentTools: boolean;
    showOnboardingView: boolean;
};
declare type State = {
    isOnboardingFinished: boolean;
};
declare class DevMenuView extends React.PureComponent<Props, State> {
    static contextType: React.Context<Context | null>;
    context: Context;
    constructor(props: Props, context: Context);
    collapse: () => Promise<void>;
    collapseAndCloseDevMenuAsync: () => Promise<void>;
    onAppReload: () => void;
    onCopyTaskUrl: () => Promise<void>;
    onGoToHome: () => void;
    onPressDevMenuButton: (key: any) => void;
    onOnboardingFinished: () => void;
    maybeRenderDevelopmentTools(): JSX.Element | null;
    renderDevMenuItem(key: any, item: any): JSX.Element;
    renderContent(): JSX.Element;
    render(): JSX.Element;
}
export default DevMenuView;
