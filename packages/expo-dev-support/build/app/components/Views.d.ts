import * as React from 'react';
import { View, ScrollView } from 'react-native';
declare type ViewProps = View['props'];
interface Props extends ViewProps {
    lightBackgroundColor?: string;
    darkBackgroundColor?: string;
    lightBorderColor?: string;
    darkBorderColor?: string;
}
declare type ScrollViewProps = ScrollView['props'];
interface StyledScrollViewProps extends ScrollViewProps {
    lightBackgroundColor?: string;
    darkBackgroundColor?: string;
}
export declare const StyledScrollView: React.ForwardRefExoticComponent<StyledScrollViewProps & React.RefAttributes<ScrollView>>;
export declare const Separator: (props: Readonly<import("react-native").ViewProps> & Readonly<{
    children?: React.ReactNode;
}>) => JSX.Element;
export declare const SectionLabelContainer: (props: Readonly<import("react-native").ViewProps> & Readonly<{
    children?: React.ReactNode;
}>) => JSX.Element;
export declare const GenericCardContainer: (props: Readonly<import("react-native").ViewProps> & Readonly<{
    children?: React.ReactNode;
}>) => JSX.Element;
export declare const GenericCardBody: (props: Readonly<import("react-native").ViewProps> & Readonly<{
    children?: React.ReactNode;
}>) => JSX.Element;
export declare const StyledView: (props: Props) => JSX.Element;
export declare const StyledButton: (props: any) => JSX.Element;
export {};
