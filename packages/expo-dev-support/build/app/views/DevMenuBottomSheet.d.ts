import React from 'react';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { EventSubscription } from 'react-native';
declare type Props = {
    uuid: string;
};
declare class DevMenuBottomSheet extends React.PureComponent<Props, any> {
    ref: React.RefObject<BottomSheet>;
    snapPoints: React.ReactText[];
    callbackNode: Animated.Value<0>;
    backgroundOpacity: Animated.Node<number>;
    closeSubscription: EventSubscription | null;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    collapse: () => Promise<void>;
    collapseAndClose: () => Promise<void>;
    expand: () => void;
    unsubscribeCloseSubscription: () => void;
    onCloseEnd: () => void;
    providedContext: {
        expand: () => void;
        collapse: () => Promise<void>;
    };
    renderHeader: () => JSX.Element;
    renderContent: () => JSX.Element;
    render(): JSX.Element;
}
export default DevMenuBottomSheet;
