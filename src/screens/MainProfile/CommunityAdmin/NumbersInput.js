import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {Header, TouchableOpacity, useColor} from '@src/components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shadowStyle} from '@src/styles';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const NumbersInput = () => {
  const {Color} = useColor();

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header title="Input Nomor Punggung" />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderTopWidth: 4,
          borderColor: Color.theme,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 5,
        }}>
        <View
          style={{
            width: '90%',
            height: 46,
            borderRadius: 22.5,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Color.textInput,
            ...shadowStyle,
          }}>
          <Ionicons name="search" size={22} color={Color.primary} />
          <TextInput
            placeholder="Cari Memberr"
            autoFocus
            placeholderTextColor={Color.gray}
            style={{
              height: 50,
              color: Color.gray,
              fontSize: 14,
              fontFamily: 'Raleway-Regular',
              marginLeft: 8,
            }}
          />
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            marginTop: 15,
            borderWidth: 0.5,
            borderRadius: 15,
            width: '80%',
            flexDirection: 'row',
            padding: 15,
            alignItems: 'center',
          }}>
          <View style={{backgroundColor: 'blue', width: 60, height: 60}}></View>
          <View style={{marginLeft: 10}}>
            <Text style={{paddingBottom: 5}}>Daffa</Text>
            <View style={{flexDirection: 'row', width: 200, height: 33}}>
              <TextInput
                placeholder="Input Nomor"
                placeholderTextColor={Color.gray}
                style={{
                  color: Color.gray,
                  fontSize: 14,
                  fontFamily: 'Raleway-Regular',
                  width: 160,
                  backgroundColor: '#fff',
                  padding: 10,
                }}
              />
              {/* <View style={{backgroundColor: 'orange',width:155,height:35}}></View> */}
              <TouchableOpacity
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: Color.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 20,
                }}>
                <Ionicons name="arrow-forward" color={Color.theme} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 15,
            borderWidth: 0.5,
            borderRadius: 15,
            width: '80%',
            flexDirection: 'row',
            padding: 15,
            alignItems: 'center',
          }}>
          <View style={{backgroundColor: 'blue', width: 60, height: 60}}></View>
          <View style={{marginLeft: 10}}>
            <Text style={{paddingBottom: 5}}>Faiz</Text>
            <View style={{flexDirection: 'row', width: 200, height: 33}}>
              <TextInput
                placeholder="Input Nomor"
                placeholderTextColor={Color.gray}
                style={{
                  color: Color.gray,
                  fontSize: 14,
                  fontFamily: 'Raleway-Regular',
                  width: 160,
                  backgroundColor: '#fff',
                  padding: 10,
                }}
              />
              {/* <View style={{backgroundColor: 'orange',width:155,height:35}}></View> */}
              <TouchableOpacity
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: Color.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 20,
                }}>
                <Ionicons name="arrow-forward" color={Color.theme} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 15,
            borderWidth: 0.5,
            borderRadius: 15,
            width: '80%',
            flexDirection: 'row',
            padding: 15,
            alignItems: 'center',
          }}>
          <View style={{backgroundColor: 'blue', width: 60, height: 60}}></View>
          <View style={{marginLeft: 10}}>
            <Text style={{paddingBottom: 5}}>Eric</Text>
            <View style={{flexDirection: 'row', width: 200, height: 33}}>
              <TextInput
                placeholder="Input Nomor"
                placeholderTextColor={Color.gray}
                style={{
                  color: Color.gray,
                  fontSize: 14,
                  fontFamily: 'Raleway-Regular',
                  width: 160,
                  backgroundColor: '#fff',
                  padding: 10,
                }}
              />
              {/* <View style={{backgroundColor: 'orange',width:155,height:35}}></View> */}
              <TouchableOpacity
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: Color.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 20,
                }}>
                <Ionicons name="arrow-forward" color={Color.theme} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </MainView>
  );
};

export default NumbersInput;
