import React, { Component } from 'react';
import { AppRegistry, Text, TextInput, View } from 'react-native';

export default class Input extends Component {
  render() {
    return (
      <View>
        <TextInput
          style={{height: 40, width: 300, fontSize: 16}}
          placeholder="Home Address"
          onChangeText={(text) => this.props.setStart(text)}
          value={this.props.startText}
        />
        <TextInput
          style={{height: 40, width: 300, fontSize: 16}}
          placeholder="Work Address"
          onChangeText={(text) => this.props.setEnd(text)}
          value={this.props.endText}
        />
      </View>
    );
  }
}
