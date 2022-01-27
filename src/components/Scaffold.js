import React, { } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import {
    Header,
    ScreenIndicator, ScreenEmptyData,
    Popup, Loading,
    useColor
} from '@src/components';
import { MainView } from '@src/styled';

const propTypes = {
    children: PropTypes.node,
    header: PropTypes.node,
    headerTitle: PropTypes.string,
    iconRightButton: PropTypes.node,
    fallback: PropTypes.bool,
    empty: PropTypes.bool,
    emptyTitle: PropTypes.string,
    popupProps: PropTypes.object,
    loadingProps: PropTypes.object,
};

const defaultProps = {
    headerTitle: '',
    fallback: false,
    empty: false,
    popupProps: {
        visible: false
    },
    loadingProps: {
        visible: false,
    }
};

const Scaffold = ({
    children,
    header,
    headerTitle,
    iconRightButton,
    onPressLeftButton,
    fallback,
    empty,
    emptyTitle,
    popupProps,
    color,
    loadingProps
}) => {
    const { Color } = useColor();
    const navigation = useNavigation();

    return (
        <MainView style={{backgroundColor: color ? Color[color] : Color.theme }}>
            {header ?
                header
            :
                <Header
                    title={headerTitle}
                    onPressLeftButton={() => onPressLeftButton ? onPressLeftButton() : navigation.pop()}
                    iconRightButton={iconRightButton}
                />
            }

            {fallback ?
                <ScreenIndicator transparent />
            : empty || emptyTitle ?
                <>
                    <ScreenEmptyData message={emptyTitle || 'Data tidak tersedia'} />
                </>
            :
                children
            }

            <Loading { ...loadingProps } />

            <Popup { ...popupProps } />
        </MainView>
    )
};

Scaffold.propTypes = propTypes;
Scaffold.defaultProps = defaultProps;

export default Scaffold;