import React, { useState, useEffect } from "react";
import { View, FlatList, Animated } from 'react-native';
import Moment from 'moment';

import { Scaffold, TouchableOpacity, Text, useColor } from "src/components";
import { Divider } from "src/styled";
import client from "src/lib/apollo";
import { queryGetNotificationHistory } from "src/lib/query";

const NotificationScreen = ({ navigation, route }) => {
  const { Color } = useColor();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.query({
      query: queryGetNotificationHistory
    })
      .then((res) => {
        const data = res.data.getNotificationHistory;
        let newArr = [];

        if (data) {
          newArr = data;
        }

        setHistory(newArr);
        setLoading(false);
      })
      .catch((err) => {
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
      headerTitle='Notifikasi'
      fallback={loading}
      empty={history.length === 0}
      emptyTitle="Notifikasi belum tersedia"
    >      
      <FlatList
        keyExtractor={(item, index) => item.id+index.toString()}
        data={history}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => onSelectNotif(item)}
              activeOpacity={0.75}
              style={{
                width: '100%',
                paddingHorizontal: 16,
                paddingVertical: 16,
                backgroundColor: Color.textInput,
                borderColor: Color.border,
                borderWidth: 0.5,
              }}
            >
              <Text align='left' type='bold'>{item.notification_title}</Text>
              <Divider height={4} />
              <Text align='left'>{item.notification_text}</Text>
              <Divider height={4} />
              <Text align='left' size={12}>{Moment(item.notification_date).format('HH:mm')}</Text>
            </TouchableOpacity>
          )
        }}
      />

      {history.length > 0 && renderPopUpNavigation()}
    </Scaffold>
  );
}

export default NotificationScreen;