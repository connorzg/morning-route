import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Input from './components/Input.js'

export default class MorningRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startText: '',
            endText: '',
            summary: ''
        };
    }
    
    render() {
        return (
            <View style={styles.container}>

                <Input
                  setStart={() => this._setStart}
                  setEnd={() => this._setEnd}
                />

                <Button
                  onPress={() => this._handleInput}
                  title="Set Your Commute" color="steelblue"
                  accessibilityLabel="Set Your Commute"
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});

AppRegistry.registerComponent('MorningRoute', () => MorningRoute);
