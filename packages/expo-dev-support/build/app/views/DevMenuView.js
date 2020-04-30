import React from 'react';
import { Clipboard, PixelRatio, StyleSheet } from 'react-native';
import * as DevSupportInternal from '../DevSupportInternal';
import * as DevMenu from './DevMenuModule';
import DevMenuButton from './DevMenuButton';
import { StyledView } from '../components/Views';
import DevMenuTaskInfo from './DevMenuTaskInfo';
import DevMenuOnboarding from './DevMenuOnboarding';
import DevMenuCloseButton from './DevMenuCloseButton';
import DevMenuBottomSheetContext from './DevMenuBottomSheetContext';
// These are defined in EXVersionManager.m in a dictionary, ordering needs to be
// done here.
const DEV_MENU_ORDER = [
    'dev-live-reload',
    'dev-hmr',
    'dev-remote-debug',
    'dev-reload',
    'dev-perf-monitor',
    'dev-inspector',
];
const MENU_ITEMS_ICON_MAPPINGS = {
    'dev-hmr': 'run-fast',
    'dev-remote-debug': 'remote-desktop',
    'dev-perf-monitor': 'speedometer',
    'dev-inspector': 'border-style',
};
class DevMenuView extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.collapse = async () => {
            if (this.context) {
                await this.context.collapse();
            }
        };
        this.collapseAndCloseDevMenuAsync = async () => {
            await this.collapse();
            await DevSupportInternal.closeMenuAsync();
        };
        this.onAppReload = () => {
            this.collapse();
            DevMenu.reloadAppAsync();
        };
        this.onCopyTaskUrl = async () => {
            const { manifestUrl } = this.props.task;
            await this.collapseAndCloseDevMenuAsync();
            Clipboard.setString(manifestUrl);
            alert(`Copied "${manifestUrl}" to the clipboard!`);
        };
        this.onGoToHome = () => {
            this.collapse();
            DevMenu.goToHomeAsync();
        };
        this.onPressDevMenuButton = key => {
            DevMenu.selectItemWithKeyAsync(key);
        };
        this.onOnboardingFinished = () => {
            DevMenu.setOnboardingFinishedAsync(true);
            this.setState({ isOnboardingFinished: true });
        };
        this.state = {
            isOnboardingFinished: !props.showOnboardingView,
        };
    }
    maybeRenderDevelopmentTools() {
        const devMenuItems = Object.keys(this.props.devMenuItems).sort((a, b) => DEV_MENU_ORDER.indexOf(a) - DEV_MENU_ORDER.indexOf(b));
        if (this.props.enableDevelopmentTools && this.props.devMenuItems) {
            return (<>
          <StyledView style={styles.separator}/>
          {devMenuItems.map(key => {
                return this.renderDevMenuItem(key, this.props.devMenuItems[key]);
            })}
        </>);
        }
        return null;
    }
    renderDevMenuItem(key, item) {
        const { label, isEnabled, detail } = item;
        return (<DevMenuButton key={key} buttonKey={key} label={label} onPress={this.onPressDevMenuButton} icon={MENU_ITEMS_ICON_MAPPINGS[key]} isEnabled={isEnabled} detail={detail}/>);
    }
    renderContent() {
        const { task } = this.props;
        const { isOnboardingFinished } = this.state;
        return (<>
        {!isOnboardingFinished && <DevMenuOnboarding onClose={this.onOnboardingFinished}/>}

        <DevMenuTaskInfo task={task}/>

        <StyledView style={styles.separator}/>

        <DevMenuButton buttonKey="reload" label="Reload" onPress={this.onAppReload} icon="reload"/>
        {task && task.manifestUrl && (<DevMenuButton buttonKey="copy" label="Copy link to clipboard" onPress={this.onCopyTaskUrl} icon="clipboard-text"/>)}
        <DevMenuButton buttonKey="home" label="Go to Home" onPress={this.onGoToHome} icon="home"/>

        {this.maybeRenderDevelopmentTools()}
        <DevMenuCloseButton style={styles.closeButton} onPress={this.collapseAndCloseDevMenuAsync}/>
      </>);
    }
    render() {
        return (<StyledView style={styles.container} darkBackgroundColor="#000">
        {this.renderContent()}
      </StyledView>);
    }
}
DevMenuView.contextType = DevMenuBottomSheetContext;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    scrollView: {
        flex: 1,
    },
    buttonContainer: {
        backgroundColor: 'transparent',
    },
    separator: {
        borderTopWidth: 1 / PixelRatio.get(),
        height: 12,
        marginVertical: 4,
        marginHorizontal: -1,
    },
    closeButton: {
        position: 'absolute',
        right: 12,
        top: 12,
        zIndex: 3,
    },
});
export default DevMenuView;
//# sourceMappingURL=DevMenuView.js.map