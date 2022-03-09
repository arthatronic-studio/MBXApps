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
    showSeeAllText: PropTypes.bool,
    style: PropTypes.object,
}

const defaultProps = {
    title: '',
    onSeeAllPress: () => {},
    showSeeAllText: true,
    style: {},
}

const PostingHeader = (props) => {
    const {
        title,
        onSeeAllPress,
        showSeeAllText,
        style,
    } = props;

    const {Color} = useColor();

    return (
        <Container
            width='100%'
            align='center'
            justify='space-between'
            style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                ...style,
            }}
        >
            <Text type="bold">{title}</Text>
            {showSeeAllText && <Text
                onPress={() => onSeeAllPress()}
                size={12}
                color={Color.primary}>
                Lihat Semua{' '}
                <Ionicons name="arrow-forward" size={12} color={Color.primary} />
            </Text>}
        </Container>
    )
}

PostingHeader.propTypes = propTypes;
PostingHeader.defaultProps = defaultProps;
export default PostingHeader;