import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    Text,
    TouchableOpacity,
    Loading,
    useLoading,
    useColor,
} from '@src/components';
import { useNavigation } from '@react-navigation/core';
import { Container, Row } from 'src/styled';

const propTypes = {
    title: PropTypes.string,
    iconType: PropTypes.string,
    iconName: PropTypes.string,
    onSeeAllPress: PropTypes.func,
    showSeeAllText: PropTypes.bool,
    style: PropTypes.object,
};

const defaultProps = {
    title: '',
    onSeeAllPress: () => {},
    showSeeAllText: true,
    style: {},
    iconType: null,
    iconName: null,
};

const PostingHeader = (props) => {
    const {
        title,
        onSeeAllPress,
        showSeeAllText,
        style,
        iconType,
        iconName
    } = props;

    const {Color} = useColor();

    const getIconMenu = (iconType, iconName) => {
        switch(iconType) {
            case 'MaterialIcons':
                return <MaterialIcons name={iconName} size={32} style={{marginRight: 10}}/>
            case 'AntDesign':
                return <AntDesign name={iconName} size={28} style={{marginRight: 10}}/>
            case 'Ionicons': 
                return <Ionicons name={iconName} size={28} style={{marginRight: 10}}/>
            case 'Entypo':
                return <Entypo name={iconName} size={30} style={{marginRight: 10}}/>
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={iconName} size={30} style={{marginRight: 10}}/>
        }
    }

    return (
        <Container
            width='100%'
            align='center'
            justify='space-between'
            style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                paddingBottom: 16,
                ...style,
            }}
        >   
            <Row>
                {iconType && iconName && getIconMenu(iconType, iconName)}
                <Text type="bold" align='left' size={16}>{title}</Text>
            </Row>
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