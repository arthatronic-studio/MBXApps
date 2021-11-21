import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CardPlace from 'src/components/Posting/CardPlace';
import {
    Text,
    TouchableOpacity,
    HeaderBig,
    Loading,
    useLoading,
    useColor,
} from '@src/components';
import { useNavigation } from '@react-navigation/core';
import { Container } from 'src/styled';

const propTypes = {
    title: PropTypes.string,
    onSeeAllPress: PropTypes.func,
}

const defaultProps = {
    title: '',
    onSeeAllPress: () => {},
}

const HeaderPost = (props) => {
    const {
        title, onSeeAllPress,
    } = props;

    const {Color} = useColor();

    return (
        <Container
            width='100%'
            align='center'
            justify='space-between'
            paddingHorizontal={16}
            style={{
                flexDirection: 'row',
            }}
        >
            <Text type="bold">{title}</Text>
            <Text
                onPress={() => onSeeAllPress()}
                size={12}
                color={Color.primary}>
                Lihat Semua{' '}
                <Ionicons name="arrow-forward" size={12} color={Color.primary} />
            </Text>
        </Container>
    )
}

HeaderPost.propTypes = propTypes;
HeaderPost.defaultProps = defaultProps;
export default HeaderPost;