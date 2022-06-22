import React, { useState, useEffect } from "react";
import { View, FlatList, Animated,Image } from 'react-native';
import Moment from 'moment';

import { Scaffold, TouchableOpacity, Text, useColor } from "src/components";
import { Divider } from "src/styled";
import client from "src/lib/apollo";
import { queryGetNotificationHistory } from "src/lib/query";
import { queryGetNotification } from "src/lib/query";
const NotificationScreen = ({ navigation, route }) => {
  const { Color } = useColor();


const initialDataRooms = {
  data: [],
  loading: true,
  page: 0,
  loadNext: false,
  refresh: false,
};
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const variables = {
      page : 0,
      itemPerPage: 9999
    }
    client.query({
      query: queryGetNotification,
      variables,
    })
      .then((res) => {
        const data = res.data.getNotification;
        console.log('ini err',data);
        let newArr = [];

        if (data) {
          newArr = data;
        }

        setHistory(newArr);
        setLoading(false);
      })
      .catch((err) => {
        console.log('ini err',err);
        setLoading(false);
      })
  }, []);

  const renderPopUpNavigation = () => {
    return (
      <Animated.View
        style={[
          {position: 'absolute', bottom: 20, height: 36, width: '40%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center'},
        ]}
      >
        <View style={{width: '100%', height: 36, backgroundColor: Color.primary, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
            shadowColor: "#00000029",
            shadowOffset: { width: 0, height: 2, },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <TouchableOpacity
              onPress={() => {}}
              style={{alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}
              activeOpacity={0.75}
            >
              <Text color={Color.textInput}>Baca Semua</Text>
            </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  const onSelectNotif = (item) => {
    navigation.navigate('NotificationDetail', { item });
  }
    
  return (
    <Scaffold
      headerTitle='Semua Notifikasi'
      fallback={loading}
      empty={history.length === 0}
      emptyTitle="Notifikasi belum tersedia"
    >      
      <FlatList
        keyExtractor={(item, index) => item.id+index.toString()}
        data={history}
        renderItem={({ item }) => {
          return (
            <View  style={{flexDirection:'row',paddingHorizontal:16, paddingVertical: 16, borderColor: Color.border,
            borderWidth: 0.5,}}>
              
              <Image
                                        source={{uri: item.image}}
                                        style={{width: '15%', aspectRatio: 1, borderRadius: 400/2, backgroundColor: Color.border}}
                                    />
              <TouchableOpacity
              onPress={() => onSelectNotif(item)}
              activeOpacity={0.75}
              style={{
                width: '100%',
                paddingHorizontal: 16,
                
                backgroundColor: Color.textInput,
               
              }}
            >
              <Text align='left'  type='bold'>{item.title}</Text>
              <Divider height={4} />
              <View style={{paddingEnd:30}}>
                
              <Text align='left' size={12} numberOfLines={3}>{item.text}</Text>
              </View>
              <Divider height={4} />
              <View style={{flexDirection:'row',justifyContent:'space-between',paddingEnd:40}}>  
              <Text size={10} align='left'>{Moment(parseInt(item.date, 10)).fromNow()}</Text>
              <Text align="left" size={10}>
                {Moment(parseInt(item.date)).format('HH:mm')}
              </Text>      
              </View>  
            </TouchableOpacity>
            </View>
          )
        }}
      />

      {/* {history.length > 0 && renderPopUpNavigation()} */}
    </Scaffold>
  );
}

export default NotificationScreen;