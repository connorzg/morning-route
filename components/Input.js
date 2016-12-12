import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  TextInput,
  View,
  StyleSheet
} from 'react-native';

export default class Input extends Component {
  render() {
    return (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Home Address"
          onChangeText={(text) => this.props.setStart(text)}
          value={this.props.startText}
        />
        <TextInput
          style={styles.input}
          placeholder="Work Address"
          onChangeText={(text) => this.props.setEnd(text)}
          value={this.props.endText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    fontSize: 16
  }
})
