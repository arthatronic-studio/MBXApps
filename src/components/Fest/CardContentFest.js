import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Text,
    useColor,
} from '@src/components';
import Client from '@src/lib/apollo';
import { queryAddLike } from '@src/lib/query';
import { useSelector } from 'react-redux';
import { fetchContentProductDetail } from 'src/api/content';
import CardFestLineup from './CardFestLineup';

const defaultProps = {
    productCategory: '',
    category: '',
    onPress: () => { },
    numColumns: 2,
    horizontal: false,
    style: {},
};

const CardContentFest = ({ productCategory, category,item, numColumns, onPress, horizontal, style }) => {
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

    const onPressCard = async() => {
        const result = await fetchContentProductDetail(item.code);
        console.log('result', result);
    }

    const props = { productCategory, item, numColumns, onPress, horizontal, style };

    if (productCategory === 'MUSIK') return <CardFestLineup { ...props } />;
    else if (productCategory === 'LINEUP') return <CardFestLineup { ...props } />;
    else if (productCategory === 'ARTS') return <CardFestLineup { ...props } />;
    else if (productCategory === 'EVENT') return <CardFestLineup { ...props } />;
    else if (productCategory === 'LITERATUR') return <CardFestLineup { ...props } />;
    else if (productCategory === 'VENUES') return <CardFestLineup { ...props } />;
    else if (productCategory === 'AREA') return <CardFestLineup { ...props } />;
    
    return <Text>Not Set</Text>;
}

CardContentFest.defaultProps = defaultProps
export default CardContentFest;

