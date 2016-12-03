import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Input from './Input.js';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startText: '',
            endText: '',
            summary: ''
        };
    }

    _setStart(text) {
        console.log(text);
        this.setState({startText: text});
    }

    _setEnd(text) {
        console.log(text);
        this.setState({endText: text});
    }

    _getRoute(start, end) {
        let query = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=AIzaSyB3xsLMFn2XoZfmywOnsWn8tf0Ffvw7FF0`
        fetch(query).then((response) => response.json()).then((responseText) => {
            this.setState({summary: responseText});
            console.log(this.state.summary);
        }).catch(function(error) {
            console.log(error);
        });
    }

    _handleInput() {
        console.log('hi');
        console.log(this.state.startText, this.state.endText);
        var locations = [this.state.startText, this.state.endText];
        locations.forEach(function(location) {
            location.replace(/\s+/g, '+');
        })
        this._getRoute(locations[0], locations[1]);
    }

    render() {
        return (
            <View style={styles.container}>

                <Text>state: {this.state.startText}</Text>
                <Input
                  setStart={() => this._setStart}
                  setEnd={() => this._setEnd}
                  startText={this.state.startText}
                  endText={this.state.endText}
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
