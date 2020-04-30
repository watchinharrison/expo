import React from 'react';
import { StyleSheet } from 'react-native';
import { AppearanceProvider, useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { ThemeContext } from 'react-navigation';

import * as DevSupportInternal from '../DevSupportInternal';
import DevMenuBottomSheet from './DevMenuBottomSheet';
import DevMenuView from './DevMenuView';

function useUserSettings(renderId): DevSupportInternal.DevMenuSettingsType {
  const [settings, setSettings] = React.useState({});

  React.useEffect(() => {
    async function getUserSettings() {
      const settings = await DevSupportInternal.getSettingsAsync();
      setSettings(settings);
    }

    getUserSettings();
  }, [renderId]);

  return settings;
}

export default class DevMenuRoot extends React.PureComponent<any, any> {
  render() {
    return <DevMenuApp {...this.props} />;
  }
}

function DevMenuApp(props) {
  const colorScheme = useColorScheme();
  const { preferredAppearance = 'no-preference' } = useUserSettings(props.uuid);

  let theme: ColorSchemeName =
    preferredAppearance === 'no-preference' ? colorScheme : preferredAppearance;
  if (theme === 'no-preference') {
    theme = 'light';
  }

  return (
    <AppearanceProvider style={styles.rootView}>
      <DevMenuBottomSheet uuid={props.uuid}>
        <ThemeContext.Provider value={theme}>
          <DevMenuView {...props} />
        </ThemeContext.Provider>
      </DevMenuBottomSheet>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});
