import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { useNavigation } from '@react-navigation/native';

import {
    Text,
    TouchableOpacity,
    useColor,
} from '@src/components';
import { shadowStyle } from '@src/styles';

import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';

import {
    iconLocation,
    iconCategory,
    iconComment,
    iconLiked,
    iconLike,
} from '@assets/images/home';
import { Container, Divider, Row } from 'src/styled';
import { analyticMethods, GALogEvent } from 'src/utils/analytics';
import { useSelector } from 'react-redux';
import CardComponentYoutube from './CardComponentYoutube';
import CardComponentVideo from './CardComponentVideo';

const defaultProps = {
    productCategory: '',
    onPress: () => { },
    numColumns: 1,
    horizontal: false,
    style: {},
};

const CardContentProduct = ({ productCategory, item, numColumns, onPress, horizontal, style }) => {
    const [like, setLike] = useState(item.like);
    const [im_like, setImLike] = useState(item.im_like);
    const [trigger, setTrigger] = useState(false);

    const { Color } = useColor();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const user = useSelector(state => state['user.auth'].login.user);

    useEffect(() => {
        setLike(item.like);
        setImLike(item.im_like);
    }, [item]);

    useEffect(() => {
        const timeout = trigger ? setTimeout(() => {
            fetchAddLike();
        }, 500) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [trigger]);

    const fetchAddLike = () => {
        console.log('trigger emergency');

        Client.query({
            query: queryAddLike,
            variables: {
                productId: item.id
            }
        })
            .then((res) => {
                console.log(res, 'res add like');
                setTrigger(false);
            })
            .catch((err) => {
                console.log(err, 'err add like');
                setTrigger(false);
            });
    }

    const onSubmitLike = () => {
        setLike(!im_like ? like + 1 : like - 1);
        setImLike(!im_like);
        setTrigger(true);
    }

    const renderCardEmergency = () => {
        return (
            <View
                style={[
                    {
                        width: width / numColumns - (horizontal ? 32 : 16),
                        paddingHorizontal: 8,
                        marginBottom: 16,
                        ...shadowStyle,
                    },
                    style
                ]}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('EmergencyDetail', { item });
                        GALogEvent('Tempat', {
                            id: item.id,
                            product_name: item.productName,
                            user_id: user.userId,
                            method: analyticMethods.view,
                          });
                    }}
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        padding: 16,
                        backgroundColor: Color.textInput,
                        borderRadius: 8,
                        aspectRatio: 16 / 9,
                    }}
                >
                    <Image
                        source={{ uri: item.image }}
                        style={{ height: '100%', width: '25%', aspectRatio: 1, borderRadius: 8, backgroundColor: Color.border }}
                    />

                    <View style={{ height: '100%', width: '75%', justifyContent: 'space-between', paddingLeft: 16 }}>
                        <Container>
                            <Text size={14} type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                            <Divider height={4} />
                            <Row>
                                <Container width={16}>
                                    <Ionicons name='person' color={Color.text} />
                                </Container>
                                <Text size={12} align='left' numberOfLines={1}>{item.fullname}</Text>
                            </Row>
                            <Divider height={4} />
                            <Row>
                                <Container width={16}>
                                    <Image
                                        style={{ height: 10, width: 10 }}
                                        source={iconCategory}
                                    />
                                </Container>
                                {/* <Text size={12}>{item.productCategory}</Text> */}
                                <Text size={12}>HELP ME</Text>
                            </Row>
                            {/* <Row>
                                <Image
                                    style={{ height: 10, width: 10}}
                                    source={iconLocation}
                                />
                                <Text size={12}>Kebon Jeruk, Jakarta</Text>
                            </Row> */}

                            <View style={{ marginTop: 8 }}>
                                <Text size={11} align='left' numberOfLines={3} >
                                    {item.productDescription}
                                </Text>
                            </View>
                        </Container>

                        <Container>
                            <View style={{ width: '100%', flexDirection: 'row', marginTop: 16 }}>
                                <TouchableOpacity onPress={() => onSubmitLike(item)} style={{ width: '50%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderColor: Color.border }}>
                                    {/* <Image
                                        style={{ height:20, width:20 }}
                                        source={im_like ? iconLiked : iconLike}
                                    /> */}
                                    <MaterialCommunityIcons
                                        name={im_like ? 'rocket-launch' : 'rocket-launch-outline'}
                                        color={im_like ? Color.success : Color.text}
                                        size={17}
                                    />
                                    <Text style={{ marginLeft: 4, marginBottom: 4 }} size={14}>{like} </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('CommentListScreen', { item })} style={{ width: '50%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ height: 17, width: 17, tintColor: Color.text }}
                                        source={iconComment}
                                    />
                                    <Text style={{ marginLeft: 4, marginBottom: 4 }} size={14}>{item.comment} </Text>
                                </TouchableOpacity>
                            </View>
                        </Container>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderCardArticle = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('NewsDetail', { item });

                    GALogEvent('Artikel', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    })

                }}
                style={[
                    {
                        width: width / numColumns - 16,
                        paddingHorizontal: 8,
                        marginBottom: 16,
                        flexDirection: 'row',
                    },
                    style,
                ]}>
                    <View
                            style={{
                                width: '100%',
                                flexDirection: 'column',
                                padding: 16,
                                borderRadius: 4,
                                backgroundColor: Color.textInput,
                                ...shadowStyle,
                            }}
                    >
                        <View style={{flexDirection: 'row'}}>
                            <View style={{ width: '25%', }}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={{
                                        width: '100%',
                                        aspectRatio: 1,
                                        borderRadius: 8,
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={{ width: '75%', paddingLeft: 16 }}>
                                <View
                                    style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text type="bold" align="left" numberOfLines={2}>
                                        {item.productName}
                                    </Text>
                                    
                                </View>
                                <View style={{ paddingTop: 4 }}>
                                    <Text size={10} align="left" numberOfLines={3} style={{ width: '90%', lineHeight: 15 }}>
                                        {item.productDescription}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            <View style={{width: '70%'}}>
                                <Text color={Color.secondary} size={10} align='left'>{item.fullname} | {Moment(parseInt(item.created_date)).format('DD MMMM YYYY')}</Text>
                            </View>
                            <View style={{width: '30%'}}>
                                <Text color={Color.primary} size={10} align='left'>Baca Selengkapnya</Text>
                            </View>
                        </View>
                    </View>
                
            </TouchableOpacity>
        )
    }

    const renderCardEvent = () => {
        let eventDate = !isNaN(parseInt(item.eventDate)) ? parseInt(item.eventDate) : null;
        if (!eventDate) eventDate = !isNaN(parseInt(item.updated_date)) ? parseInt(item.updated_date) : null;

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('EventDetail', { item });

                    GALogEvent('Event', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    });
                }}
                style={[
                    {
                        width: width / numColumns - (horizontal ? 32 : 16),
                        paddingHorizontal: 8,
                        marginBottom: 16,
                        borderRadius: 4
                    },
                    style,
                ]}
            >
                <View style={{flexDirection: 'row', width: '100%', backgroundColor: Color.textInput, borderRadius: 4, ...shadowStyle}}>
                    <Image
                        source={{uri: item.image}}
                        style={{width: '35%', aspectRatio: 9/16, borderTopLeftRadius: 4, borderBottomLeftRadius: 4, backgroundColor: Color.border}}
                    />
    
                    <View style={{width: '65%', padding: 16, borderTopRightRadius: 4, borderBottomRightRadius: 4, backgroundColor: Color.textInput}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{width: 70, paddingVertical: 4, paddingHorizontal: 16, borderWidth: 0.5, borderRadius: 8, borderColor: Color.primary}}>
                                <Text size={10} color={Color.primary}>{item.productCategory}</Text>
                            </View>
    
                            {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
                        </View>
    
                        <View style={{paddingTop: 8}}>
                            <Text type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                            <Divider height={6} />
                            <Text size={12} align='left' numberOfLines={2}>{item.fullname}</Text>
                            {Moment(eventDate).isValid() && <>
                                <Text type='bold' size={12} align='left' color={Color.primary}>{Moment(eventDate).format('DD MMM YYYY')}</Text>
                                <Divider height={8} />
                            </>}
                            <Text size={12} align='left' numberOfLines={4}>{item.productDescription}</Text>
                        </View>
    
                        {/* <View style={{paddingTop: 24, flexDirection: 'row'}}>
                            <Foundation name='calendar' color={Color.yellow} style={{marginRight: 8}} />
                            <Text size={10} align='left'>3 Bulan</Text>
                        </View> */}
    
                        {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                            <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                            <Text size={10} align='left'>Cilandak, Jakarta Selatan</Text>
                        </View> */}
    
                        {/* <View style={{paddingTop: 6, flexDirection: 'row'}}>
                            <Ionicons name='information-circle-outline' color={Color.error} style={{marginRight: 8}} />
                            <Text size={10} align='left'>3 Hari lagi Pendaftaran Ditutup</Text>
                        </View> */}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderCardJobs = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('JobDetail', { item });

                    GALogEvent('Job', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    });
                }}
                style={[
                    {
                        width: width / numColumns - 16,
                        paddingHorizontal: 8,
                        marginBottom: 16
                    },
                    style,
                ]}
            >
                <View style={{width: '100%', flexDirection: 'row', padding: 16, borderRadius: 4, backgroundColor: Color.textInput, ...shadowStyle}}>
                    <View style={{width: '20%'}}>
                        <Image
                            source={{uri: item.image}}
                            style={{
                                width: '80%',
                                aspectRatio: 1,
                                borderRadius: 8,
                            }}
                            resizeMode='contain'
                        />
                    </View>
    
                    <View style={{width: '80%'}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text type='bold' size={16} align='left' numberOfLines={2}>{item.productName}</Text>
                            {/* <Ionicons name='bookmark-outline' size={20} color={Color.primary} /> */}
                        </View>
    
                        <View style={{paddingTop: 4, flexDirection: 'row'}}>
                            <Text size={12} align='left'>Post:&nbsp;</Text>
                            <Text size={12} align='left'>{item.fullname}</Text>
                        </View>
    
                        <View style={{paddingTop: 6}}>
                            <Text size={12} align='left' numberOfLines={2}>{item.productDescription}</Text>
                        </View>
    
                        {/* <View style={{paddingTop: 12, flexDirection: 'row'}}>
                            <Ionicons name='location' color={Color.error} style={{marginRight: 8}} />
                            <Text size={12} align='left'>Jakarta Selatan</Text>
                        </View> */}
    
                        <View style={{paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text size={12} color={Color.info}>{item.like} Pelamar</Text>
                            <Text size={12}>{Moment(parseInt(item.created_date)).fromNow()}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderCardPlace = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('PlaceDetail', { item });

                    GALogEvent('Tempat', {
                        id: item.id,
                        product_name: item.productName,
                        user_id: user.userId,
                        method: analyticMethods.view,
                    });
                }}
                style={{
                    width: width / numColumns - (horizontal ? 16 : 8),
                    paddingHorizontal: 8,
                    marginBottom: 16,
                    ...style,
                }}
            >
                <View style={{
                    backgroundColor: Color.textInput,
                    ...shadowStyle,
                }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: '100%',
                            aspectRatio: 3 / 2,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                            backgroundColor: Color.border,
                        }}
                    />

                    <View style={{ width: '100%', padding: 16, backgroundColor: Color.textInput, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}>
                        <Text size={12} type='bold' align='left' numberOfLines={2}>{item.productName}</Text>
                        <Divider height={4} />
                        <Row>
                            <View style={{ width: 16 }}>
                                <Ionicons name='person' color={Color.text} />
                            </View>
                            <Text size={12} align='left' numberOfLines={2}>{item.fullname}</Text>
                        </Row>
                        <Divider />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text size={12}>{item.like}&nbsp;</Text>
                                <Ionicons
                                    name={item.im_like ? 'heart' : 'heart-outline'}
                                    color={Color.primary}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text size={12}>{item.comment > 0 ? item.comment + ' Komentar' : 'Beri Komentar'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    if (productCategory === 'EMERGENCY') return renderCardEmergency();
    else if (productCategory === 'ARTIKEL') return renderCardArticle();
    else if (productCategory === 'EVENT') return renderCardEvent();
    else if (productCategory === 'JOBS') return renderCardJobs();
    else if (productCategory === 'NEARBY_PLACE') return renderCardPlace();
    else if (productCategory === 'YOUTUBE_VIDEO') return <CardComponentYoutube item={item} />;
    else if (productCategory === 'NEWEST_VIDEO') return <CardComponentVideo item={item} />;
    return <Text>Not Set</Text>;
}

CardContentProduct.defaultProps = defaultProps
export default CardContentProduct;

