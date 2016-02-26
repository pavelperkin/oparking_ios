/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  ScrollView,
  ListView,
  RefreshControl,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

class Oparking_ios extends Component {

  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this._onPressButton = this._onPressButton.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isRefreshing: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch('http://oparking.herokuapp.com/places.json')
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.places),
        });
      })
      .done();
  }

  renderHeader() {
    return(
      <View style={styles.header}>
        <Text style={styles.headerText}>Oparking</Text>
      </View>
    )
  }

  _onPressButton(place) {
    fetch('http://oparking.herokuapp.com/places/'+place.id+'.json', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        place: {occupied: true}
      })
    }).then(() => {
      alert('Вы заняли место ' + place.parking_name+ ' #'+ place.number)
    }).then(() => {
      this.fetchData()
    })
  }

  renderRow(rowData) {
    return(
      <TouchableHighlight onPress={()=>this._onPressButton(rowData)} style={styles.slot} underlayColor='#428bca' >
        <View style={styles.placeWrapper}>
          <Text style={styles.parking}>{rowData.parking_name} -
            <Text style={styles.place}> {rowData.number}</Text>
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.fetchData()
      this.setState({
        isRefreshing: false
      });
    }, 1000);
  }

  render() {
    var _scrollView: ScrollView;
    return (
      <ScrollView
        ref={(scrollView) => { _scrollView = scrollView; }}
        automaticallyAdjustContentInsets={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor='#003e65'
            title="Loading..."
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
          />}
        scrollEventThrottle={200}
        style={styles.scrollView}>
        <ListView
          dataSource={this.state.dataSource}
          renderHeader={this.renderHeader}
          renderRow={this.renderRow}
          >
        </ListView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 20,
  },
  header: {
    backgroundColor: '#003e65',
    height: 60,
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    marginTop: 10,
    textAlign: 'center'
  },
  slot: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  place: {
    fontSize: 26,
    marginLeft: 10,
    textAlign: 'right'
  },
  parking: {
    fontSize: 19,
    marginTop: 17,
    marginLeft: 10,
    marginRight: 10,
  },
});

AppRegistry.registerComponent('Oparking_ios', () => Oparking_ios);
