import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';

import {
    Alert,
    AlertModal,
    Button,
    Grid,
    Header,
    Loading, useLoading,
    Popup, usePopup,
    ScreenEmptyData,
    ScreenIndicator,
    ListSlider,
    Submit,
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';

const defaultProps = {
};

const ExampleComponent = (props) => {
    const [state, setState] = useState();

    const ref = useRef();
    const { Color } = useColor();

    useEffect(() => {

    }, []);

    return (
        <View>

        </View>
    )
}

ExampleComponent.defaultProps = defaultProps;
export default ExampleComponent;