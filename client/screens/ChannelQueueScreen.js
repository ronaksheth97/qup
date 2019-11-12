import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

// for screen switch 
import { createBottomTabNavigator } from 'react-navigation'
import OptionScreen from './OptionScreen';
import { SearchBar } from 'react-native-elements';

import TabBarIcon from '../components/TabBarIcon'; // for bar icons

/* ChannelQueueScreen:
 *    This screen shows the song queue
 *    It should show each song as a tab stacking in a scrollview.
 *    Each song tab should be able to be swipe to open options to up and down vote songs
 */
class ChannelQueueScreen extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'QUEUE',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
    ),
  }

  render() {
    const { navigate } = this.props.navigation;
    return (

      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>
            <Text>!QUEUE!</Text>
            <Text>TODO:</Text>
            <Text>1.SHOW QUEUE IS EMPTY</Text>
            <Text>2.EACH SONG HAS ITS OWN SECTION</Text>
            <Text>3.ABLE TO SWIPE THE SONG TABS</Text>
            <Text>4.TAB GIVE OPTIONS TO DELETE (SONG OWNER ONLY)</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

/* SearchBarScreen:
 *    This screen has a search bar allows user to search a song from Spotify
 */
class SearchBarScreen extends React.Component {

  state = {
    search: '',
  };

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    return (

      <SearchBar
        inputStyle={{ backgroundColor: 'black' }}
        containerStyle={{ backgroundColor: 'white', borderWidth: 1, borderRadius: 5 }}
        placeholderTextColor={'grey'}
        placeholder={'SEARCH...'}
      />
    );
  }
}

export default createBottomTabNavigator({
  OPTION: { screen: OptionScreen },
  SEARCH: { screen: SearchBarScreen },
  Home: { screen: ChannelQueueScreen },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#89CFF0',
  },
  getStartedContainer: {
    fontSize: 20,
    backgroundColor: "white",
    alignItems: 'center',
    marginHorizontal: 0,
    marginVertical: 90
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  todoText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 24,
    textAlign: 'left',
    paddingLeft: 30
  },
});