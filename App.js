import React from 'react';
import { Button, Text, TextInput, View,Linking,AppRegistry,ListView,StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Constants from 'expo-constants';
import * as Speech from 'expo-speech';


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  speak() {
    var thingToSay = 'welcome to notepad application';
    Speech.speak(thingToSay);
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
        <Button title="PRESS TO HEAR WELCOME MESSAGE" onPress={this.speak} />
        <Button
          title="Go to Search"
          onPress={() => this.props.navigation.navigate('Search')}
        />
        <Button
          title="Go to New notepad"
          onPress={() => this.props.navigation.navigate('Notepad')}
        />
      </View>
    );
  }
}

class TodoScreen extends React.Component {
  static navigationOptions = {
    title: 'Todo',
  };
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      inputValue: '',
      dataSource: ds.cloneWithRows([]),
    };
    this._handleTextChange = this._handleTextChange.bind(this);
    this._handleDeleteButtonPress = this._handleDeleteButtonPress.bind(this);
  }
  _handleTextChange = (value) => {
    const inputValue = value;
    this.setState(() => ({
      inputValue,
    }));
  }
  _handleSendButtonPress = () => {
    if (!this.state.inputValue) {
      return;
    }
    const textArray = this.state.dataSource._dataBlob.s1;
    textArray.push(this.state.inputValue);
    this.setState(() => ({
      dataSource: this.state.dataSource.cloneWithRows(textArray),
      inputValue: '',
    }));
  };
  _handleDeleteButtonPress = (id) => {
    this.setState((a) => {
      const newItem = a.dataSource._dataBlob.s1.filter((item, i) => (parseInt(id) !== i));
      return {
        dataSource: this.state.dataSource.cloneWithRows(newItem),
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.formView}>
          <TextInput
            style={styles.inputForm}
            value={this.state.inputValue}
            onChangeText={this._handleTextChange}
            placeholder="ADD TODO"
          />
          <Button
            title="Add"
            onPress={this._handleSendButtonPress}
          />
        </View>
        <ListView
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => {
            const handleDelete = () => {
              return this._handleDeleteButtonPress(rowID);
            }
            return (
              <View style={styles.todoItem}>
                <Text style={styles.todoText}>{rowData}</Text>
                <Button
                  title="Delete"
                  onPress={handleDelete}
                  style={styles.deleteButton}
                />
              </View>
              );
            }
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#eee',
  },
  formView: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 8,
  },
  inputForm: {
    backgroundColor: '#fff',
    width: 320,
    height: 40,
    padding: 8,
    marginBottom: 8,
  },
  todoItem: {
    alignItems: 'center',
    padding: 8,
    width: 320,
    borderBottomWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    border: '1 solid #333',
    flex: 1,
    flexDirection: 'row',
  },
  todoText: {
    flex: 1,
  },
});
  

class SearchScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  static navigationOptions = {
    title: 'Search',
  };
  render() {
    return (
      <View style={{flexDirection:'row'}}>
        <Button style={{flex:0.2, height: 40, paddingLeft:5,}}
          title="Search"
          onPress={() => Linking.openURL("https://www.google.com/")}
        />
      </View>
    );
  }
}

class NotepadScreen extends React.Component {
  static navigationOptions = {
    title: 'Notepad',
  }

  constructor(props) {
    super(props);
    this.state = {
      text: '',
     colors: '#ffffff'
    };}
    setColor = (value) => {
        this.setState({ colors: value })
    }
    componentDidMount() {
        let i = 0;
        let colorsArray = ['black', 'green', 'blue', 'pink']
        this._interval = setInterval(() => {
            if (i <= 3) {
                this.setColor(colorsArray[i]);
                i++;
            }
        }, 900);
    }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
      style={{flex:5, height: 200,width:200, borderColor: 'gray',
        borderWidth: 1, margin: 5,color: this.state.colors}} 
        value={this.state.text}
        multiline={true}
        numberOfLines={500}
        onChangeText={text => this.setState({ text })}
        />  
        <Button  
        title="Submit" 
        onPress={() =>  
        this.props.navigation.navigate('Final', {data_text: this.state.text}  
         )  
    }  
        />  
      </View>
    );
  }
}
class FinalScreen extends React.Component { 
  static navigationOptions = {
    title: 'Final',
  };
  render() {
    const data_text = this.props.navigation.getParam("data_text", "");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{data_text}</Text>
      </View>
    );
  }
}

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen },
  Search: { screen: SearchScreen },
  Notepad: { screen:NotepadScreen},
  Final: { screen: FinalScreen},
});

const TodoStack = createStackNavigator({
  Todo: { screen: TodoScreen },
});

export default createAppContainer(createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Todo: { screen: TodoStack },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Todo') {
          iconName = `ios-albums`;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
));


