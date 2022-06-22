import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Container, Line } from 'src/styled';
import { TouchableOpacity } from '../Button';
import FormInput from '../FormInput';
import Scaffold from '../Scaffold';
import Text from '../Text';
import { useColor } from 'src/components/Color';
import ScreenEmptyData from 'src/components/Modal/ScreenEmptyData';

const defaultProps = {
    visible: false,
    data: [],
    extraData: [],
    onClose: () => {},
    onPress: () => {},
    name: '',
    selected: null,
    renderItem: null,
};

const codeNameWithId = ['block_2_0'];

const ModalActionScroll = ({ visible, data: propsData, extraData, onClose, onPress, name, selected, renderItem, children }) => {
    const { Color } = useColor();
    const { height, width } = useWindowDimensions();
    const scrollViewRef = useRef();

    const [data, setData] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        setData(propsData);
        setText('');
    }, [propsData]);

    useEffect(() => {
        const timeout = text !== '' ?
            setTimeout(() => {
                onSearch();
            }, 1000) : null;

        return () => {
            clearTimeout(timeout);
        }
    }, [text]);

    const onSearch = () => {
        const sourceData = Array.isArray(extraData) && extraData.length > 0 ? extraData : propsData;
        const search = new RegExp(text , 'i');
        // let b = a.filter(item => search.test(item.name) || search.test(item.caption));
        let newData = sourceData.filter(item => search.test(item.name));
        setData(newData);
    }

    const renderContent = () => {
        return data.map((item, idx) => {
            if (renderItem) {
                return renderItem(item, idx);
            }

            if (item.show === false) return <View key={idx} />;
      
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                    if (item.onPress) {
                        item.onPress();
                        return;
                    }

                    if (codeNameWithId.includes(name)) {
                        const newItem = {
                            ...item,
                            name: `${item.id} - ${item.name}`,
                        };
                        onPress(newItem, name);
                    } else {
                        onPress(item, name);
                    }
                }}
                style={{
                  width: width - 32,
                  paddingVertical: 8,
                  alignItems: 'flex-start',
                }}>
                <Text
                  align="left"
                  color={
                    item.color
                      ? item.color
                      : selected && selected.id === item.id
                      ? Color.secondary
                      : Color.text
                  }
                >
                  {codeNameWithId.includes(name) ? `${item.id} - ` : ''}{item.name}
                </Text>
                {item.caption !== '' && item.caption !== null && <Text
                  size={10}
                  align="left"
                  color={
                    item.color
                      ? item.color
                      : selected && selected.id === item.id
                      ? Color.secondary
                      : Color.text
                  }
                >
                  {item.caption}
                </Text>}
              </TouchableOpacity>
            );
        });
    }

    return (
        <Modal
            testID={'modal'}
            isVisible={visible}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            propagateSwipe={true}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <Scaffold
                onPressLeftButton={() => onClose()}
            >
                <Container paddingHorizontal={16}>
                    <FormInput
                        placeholder='Cari'
                        value={text}
                        onChangeText={(txt) => {
                            setText(txt);

                            if (txt === '') {
                                setData(propsData);
                            }
                        }}
                    />
                </Container>

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                    }}
                >
                    {Array.isArray(data) && data.length > 0 ? renderContent() : children ? children : <ScreenEmptyData /> }
                </ScrollView>
            </Scaffold>
        </Modal>
    );
}

ModalActionScroll.defaultProps = defaultProps;
export default ModalActionScroll;