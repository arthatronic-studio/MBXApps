import React from 'react';
import { View, ImageBackground, Dimensions, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';

import {
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';
import { shadowStyle } from '@src/styles';

const { width } = Dimensions.get('window');

const defaultProps = {
    componentType: 'GENERAL',
    onPress: () => {},
    numColumns: 1,
    style: {},
};

const CardForum = (props) => {
    const { componentType, item, numColumns, onPress, style } = props;

    const { Color } = useColor();

    if (componentType === 'SHOW_ALL') {
        return (
            <TouchableOpacity
                onPress={() => onPress(item)}
                style={[{width: width / numColumns - 8, paddingHorizontal: 8, marginBottom: 16, borderRadius: 4}, style]}
            >
                <ImageBackground
                    source={{uri: item.image}}
                    style={{
                        width: '100%',
                        aspectRatio: 5/6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                        ...shadowStyle,
                    }}
                    imageStyle={{borderRadius: 4}}
                    blurRadius={10}
                >
                    <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)'}} />

                    <Text size={18} type='semibold' color={Color.primary} letterSpacing={0.45}>Lihat</Text>
                    <Text size={18} type='semibold' color={Color.primary} letterSpacing={0.45}>Lainnya</Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    if (componentType === 'LIST') {
        return (
            <View style={{width, paddingHorizontal: 16, marginBottom: 16}}>
                <TouchableOpacity
                    onPress={() => onPress(item)}
                    style={[{width: '100%', flexDirection: 'row', padding: 16, borderRadius: 4, borderWidth: 0.5, borderColor: Color.border}, style]}
                >
                    <Image
                        source={{uri: item.image}}
                        style={{
                            flex: 1,
                            aspectRatio: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: Color.border,
                        }}
                    />
                    <View style={{flex: 5, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 16}}>
                        <Text size={12} type='semibold'>Pustakawan Podium</Text>
                        <View style={{flexDirection: 'row', marginTop: 4}}>
                            <Text size={10} type='medium'>2.708 Anggota</Text>
                            <Text size={10} type='medium'>20 Kiriman baru minggu ini</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text sie={12} color={Color.primary}>Lihat</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    
    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[{width: width / numColumns - 8, paddingHorizontal: 8, marginBottom: 16, borderRadius: 4}, style]}
        >
            <ImageBackground
                source={{uri: item.image}}
                style={{
                    width: '100%',
                    aspectRatio: 5/6,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderRadius: 4,
                    ...shadowStyle,
                }}
                imageStyle={{borderRadius: 4}}
            >
                <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)'}} />

                <View style={{alignItems: 'center', position: 'absolute', top: 8, right: 8, flexDirection: 'row'}}>
                    <Text size={12} type='medium' color={Color.theme}><MaterialCommunityIcons size={10} name='comment-text-multiple-outline' color={Color.theme} /> {item.comment}</Text>
                </View>

                <View style={{width: '100%', paddingHorizontal: 12, paddingBottom: 12, alignItems: 'flex-start'}}>
                    <Text size={12} type='bold' color={Color.theme} style={{marginBottom: 6}}>{item.productName}</Text>
                    <Text size={10} type='medium' color={Color.theme}>{Moment(parseInt(item.created_date, 10)).fromNow()}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}

CardForum.defaultProps = defaultProps;

export default CardForum;