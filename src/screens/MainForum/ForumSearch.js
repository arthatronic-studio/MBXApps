import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Platform, SafeAreaView, TextInput } from 'react-native';
import Styled from 'styled-components';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
    Text,
    // TouchableOpacity,
    Loading, useLoading,
    HeaderBig,
    useColor
  } from '@src/components';
import { TouchableOpacity } from '@src/components/Button';
import ListForum from '@src/screens/MainForum/ListForum';
  
import { shadowStyle } from '@src/styles';
  
import Client from '@src/lib/apollo';
import { queryContentProduct } from '@src/lib/query';

const ForumSearch = ({ navigation, route }) => {
  return (
    <View>
        <Text>Tes</Text>
    </View>
  )
}

export default ForumSearch