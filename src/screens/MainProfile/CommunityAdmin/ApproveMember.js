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

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const ApproveMember = () => {
  const [data, setData] = useState([
    {nama: 'excel', id: 1, data: true},
    {nama: 'dani', id: 2, data: true},
    {nama: 'test', id: 3, data: true},
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
    <MainView style={{backgroundColor: Color.theme}}>
      <Header title="Approve Member" />
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
              fontFamily: 'Inter-Regular',
              marginLeft: 8,
            }}
          />
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
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
                    backgroundColor: 'blue',
                    width: 60,
                    height: 60,
                  }}></View>
                <View style={{marginLeft: 10}}>
                  <Text style={{paddingBottom: 5}}>{item.nama}</Text>
                  <View style={{flexDirection: 'row', width: 200, height: 33}}>
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
                  </View>
                </View>
              </View>
            ),
        )}
      </View>
      <Popup {...popupProps} />
    </MainView>
  );
};

export default ApproveMember;
