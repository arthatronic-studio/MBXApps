import React, { useState, useEffect } from 'react';
import { View, Dimensions, Image, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryMaudiAddLike } from '@src/lib/query';

import {
    iconLocation,
    iconCategory,
    iconComment,
    iconLiked,
    iconLike,
} from '@assets/images/home';
import { Divider } from 'src/styled';

const { width } = Dimensions.get('window');

export default function PostingSkeleton(props) {
    const { Color } = useColor();

    return (
        <View
            style={[
                {
                    width: '100%',
                    aspectRatio: 21/9,
                    marginBottom: 16,
                    marginRight: 16,
                    backgroundColor: Color.textInput,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            ]}
        >
            <ActivityIndicator size='large' color={Color.primary} />
            <Divider />
            <Text>Memuat</Text>
        </View>
    )
}