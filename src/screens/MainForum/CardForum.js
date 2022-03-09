import React from 'react';
import { View, ImageBackground, Dimensions, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ImagesPath from '../../components/ImagesPath'

import {
    Col,
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
                <TouchableOpacity
                    onPress={() => onPress(item)}
                    style={[{width: width / numColumns - 60, borderRadius: 10, borderWidth: 0.5, borderColor: Color.border, marginRight: 16}]}
                >
                    <Image 
                        source={{uri: item.image}}
                        style= {{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            width: '100%',
                            height: 60,
                            backgroundColor: Color.border,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                        
                    />

                    <View
                        style={{
                            paddingHorizontal: 16,
                            paddingBottom: 24,
                        }}
                    >
                        <Image 
                            source={{uri: item.image}}
                            style= {{
                                flex: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                aspectRatio: 1,
                                width: 40,
                                height: 40,
                                backgroundColor: Color.border,
                                borderRadius: 20,
                                position: 'relative',
                                top: -20,
                            }}   
                        />

                        <View>
                            <Text size={14} type='semibold' align='left'>Pustakawan Podium</Text>
                            <Text size={10} type='medium' align='left' color={Color.gray} style={{marginTop: 4, marginBottom:10}}>2.708 Anggota</Text>
                            <Text size={12} align='left'>Carrot cake sweet gummi bears cake powder bonbon lemon drops cheesecake gummi bears. Gingerbread caramels cupcake gummies powder . . .</Text>
                        </View>

                    </View>
                </TouchableOpacity>
        )
    }
    
    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[{width: width / numColumns + 140, padding: 8, marginBottom: 16, marginRight: 12, borderRadius: 4, borderColor: Color.grayLight, borderWidth: 1, borderRadius: 8}, style]}
        >   

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                <View
                    style={{flexDirection: 'row', alignItems: 'center'}}
                >
                    <View style={{backgroundColor: Color.grayLight, width: 40, height: 40, borderRadius: 20, marginRight: 10}}>
                        <Image 
                            source={{uri: item.image}}
                            style={{
                                aspectRatio: 1
                            }}
                        />
                    </View>
                    <View>
                        <Text size={14} type='bold' align='left'>{item.productName}</Text>
                        <View style={{flexDirection: 'row', marginTop: 4}}>
                            <Text size={8} align='left'>{item.productName} - </Text>
                            <Text size={8} align='left'>{Moment(parseInt(item.created_date, 10)).fromNow()}</Text>
                        </View>
                    </View>
                </View>
                <View style={{backgroundColor: Color.primary, paddingHorizontal: 16, paddingVertical: 6, marginTop: 8, borderRadius: 120, alignSelf: 'flex-start'}}>
                    <Text size={8} align='left' color={'#ffffff'}>+ Gabung</Text>
                    
                </View>
            </View>

            <View style={{height: 60, marginBottom: 16}}>
                <Text size={14} align='left' numberOfLines={3}>{item.productDescription}...</Text>
            </View>

            <ImageBackground
                source={{uri: item.image}}
                style={{
                    width: '100%',
                    aspectRatio: 5/6,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginBottom: 16
                }}
                imageStyle={{borderRadius:10}}
            >
                <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 8}} />    
            </ImageBackground>

            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <AntDesign 
                        name={'like2'}
                        size={24}
                        color={Color.gray}
                    />
                    {/* <Text>{item.like}</Text> */}
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>5rb</Text>
                </View>
                <View>
                    <Text align='left' size={16} color={Color.gray}>|</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Image 
                        source={ImagesPath.chat}
                    />
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>251</Text>
                </View>
                <View>
                    <Text align='left' size={16} color={Color.gray}>|</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <AntDesign 
                        name={'sharealt'}
                        size={24}
                        color={Color.gray}
                    />
                    <Text size={14} align='left' color={Color.gray} style={{marginLeft: 10}}>Share</Text>
                </View>
            </View>
            
        </TouchableOpacity>
    )
}

CardForum.defaultProps = defaultProps;

export default CardForum;