import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Picker
} from 'react-native';

export default class Locations extends Component {
  render() {
    return (
      <View>

        <View>
          <Text>FROM:</Text>
          <Picker
            selectedValue={this.props.startText}
            onValueChange={(key, value) => this.props.setStart(key, value)}>
            <Picker.Item label="Home" value="5808 Miramonte Dr" />
            <Picker.Item label="Dad's" value="4701 Staggerbrush Rd" />
            <Picker.Item label="Current Location" value={this.props.currentLocation} />
          </Picker>
        </View>

        <View>
          <Text>TO:</Text>
          <Picker
            selectedValue={this.props.endText}
            onValueChange={(place) => this.props.setEnd(place)}>

            <Picker.Item label="Work" value="600 Congress Ave" />
            <Picker.Item label="Current Location" value={this.props.currentLocation} />
          </Picker>
        </View>

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
