import { Platform,Text, StyleSheet, View, TouchableOpacity, Dimensions, Image, ToastAndroid } from 'react-native'
import React, { Component } from 'react'
import MapView from 'react-native-maps'
import Entypo from 'react-native-vector-icons/Entypo'
import Geocoder from 'react-native-geocoder'
import Geolocation from '@react-native-community/geolocation';


export default class Maps extends Component {
  
  constructor(props){
    super(props);
    this.state={
      initialRegion: {
        latitude: -6.175221730206355,  
        longitude: 106.82719571259297,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0122
      },
      locationChosen: false,
      marginBottom: 1,
      currentAddress: 'Data Masih Kosong'
    }
  }

  componentDidMount(){
    this.handleUserLocation();
    setTimeout(()=> this.setState({marginBottom: 0}))
  }

  handleUserLocation=()=>{
    Geolocation.getCurrentPosition(pos => {
      // alert(JSON.stringify(pos))
      this.map.animateToRegion({
        ...this.state.initialRegion,
        latitude : pos.coords.latitude,
        longitude: pos.coords.longitude
      })

      this.setState({
        initialRegion: {
          ...this.state.initialRegion,
        latitude : pos.coords.latitude,
        longitude: pos.coords.longitude
        },
        locationChosen: true
      })
      // this.getAddress(pos.coords.latitude,pos.coords.longitude)
    },
    err => {
      console.log(err);
      alert("Something Went Wrong! Please select location manually")
    }
    )
  }

  getAddress = async(lat,lng)=>{ 
    await Geocoder.fallbackToGoogle('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY');
    try {
      let ret = await Geocoder.geocodePosition({lat, lng})
      let addr = (results[0].formatted_address)
      this.setState({
        currentAddress: addr
    })
    } catch (error) {
      alert(err)
    }
  }

  onChangeValue = initialRegion => {
    // ToastAndroid.show(JSON.stringify(this.state.currentAddress), ToastAndroid.SHORT)
    ToastAndroid.show(JSON.stringify(initialRegion), ToastAndroid.SHORT)
    this.setState({
      initialRegion
    })
  }


  render() {
    console.disableYellowBox=true;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
        <MapView
        style={{flex: 1}}
        showsUserLocation = {true}
        showsMyLocationButton = {true}
        initialRegion = {this.state.initialRegion}
        onRegionChangeComplete = {this.onChangeValue}
        ref = {ref => this.map = ref}
        />
        <View style={{top: '50%', left: '50%', marginLeft: -24, marginTop: -48, position: 'absolute'}}>
          <Entypo name={'location-pin'} size={40} style={{color: 'red'}}/>
        </View>
        <View style={{top: '95%', left: '20%', marginLeft: -24, marginTop: -48, position: 'absolute'}}>
          <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center',width: 280, height: 50, backgroundColor: '#F3771D', borderRadius: 50}}>
            <Text style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}>Simpan</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  mapContainer:{
    height: '50%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  fullMapContainer:{
    flex: 1
  },
  map:{
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end'
  }
})
