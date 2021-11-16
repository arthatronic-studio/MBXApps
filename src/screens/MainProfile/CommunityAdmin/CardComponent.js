import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import Styled from 'styled-components';
import {
  Header,
  TouchableOpacity,
  useColor,
  usePopup,
  Popup,
} from '@src/components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {joinCommunityManage} from '@src/lib/query/joinCommunityManage';
import {joinCommunityMember} from 'src/lib/query/joinCommunityMember';

const CardComponent = (props) => {
  const [data, setData] = useState([
    {name: 'excel', id: 1, data: true},
    {name: 'dani', id: 2, data: true},
    {name: 'test', id: 3, data: true},
  ]);

  const [popupProps, showPopup] = usePopup();

   // useEffect(() => {
  //   // Client.query({
  //   //   query: joinCommunityMember,
  //   //   variables: {
  //   //     status: 0,
  //   //   },
  //   // })
  //   //   .then((res) => {
  //   //     alert(JSON.stringify(res));
  //   //     setData(res.data.joinCommunityMember);
  //   //     // showPopup('test', 'warning');
  //   //   })
  //   //   .catch((err) => {
  //   //     showPopup('catch', 'warning');
  //   //   });
  // }, []);

  const handleSuccess = (index) => {
    data[index].data = false;
    setData([...data.filter((item) => item.data !== false)]);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 1,
        id: 1,
      },
    })
      .then((res) => {
        showPopup('test', 'warning');
      })
      .catch((err) => {
        showPopup('catch', 'warning');
      });
  };

  const handleRemove = (index) => {
    data[index].data = false;
    setData([...data.filter((item) => item.data !== false)]);

    Client.query({
      query: joinCommunityManage,
      variables: {
        status: 2,
        id: 1,
      },
    })
      .then((res) => {
        showPopup('test', 'warning');
      })
      .catch((err) => {
        showPopup('catch', 'warning');
      });
  };

  const {Color} = useColor();
  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      {data.map(
        (item, index) =>
          item.data && (
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
              <View
                style={{
                  backgroundColor: Color.disabled,
                  width: 60,
                  height: 60,
                }}></View>
              <View style={{marginLeft: 10}}>
                <Text style={{paddingBottom: 5}}>{item.name}</Text>

                {props.type === 'Anggota' ? (
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
                      <Ionicons
                        name="arrow-forward"
                        color={Color.theme}
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                    <View style={{flexDirection: 'row', width: 200, height: 33}}>
                    
                    <TouchableOpacity
                      onPress={() => handleSuccess(index)}
                      style={{
                        backgroundColor: Color.success,
                        flex: 1,
                        marginRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text>{props.handleSuccess}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemove(index)}
                      style={{
                        backgroundColor: Color.error,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text>{props.handleRemove}</Text>
                    </TouchableOpacity>
                  </View>
                  
                )}
              </View>
            </View>
          ),
      )}
      <Popup {...popupProps} />
    </View>
  );
};

export default CardComponent;

{
  /* ANGGOTA */
}
{
  /* <View style={{flexDirection: 'row', width: 200, height: 33}}>
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
        </View> */
}

{
  /* ANGGOTA BARU */
}
{
  /* <View style={{flexDirection: 'row', width: 200, height: 33}}>
          <TouchableOpacity
            onPress={() => handleSuccess(index)}
            style={{
              backgroundColor: 'green',
              flex: 1,
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemove(index)}
            style={{
              backgroundColor: 'red',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Remove</Text>
          </TouchableOpacity>
        </View> */
}
