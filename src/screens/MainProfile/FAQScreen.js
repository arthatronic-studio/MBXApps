import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
    Header,
    Popup, usePopup,
    Loading, useLoading,
    Submit,
    useColor,
    Text,
    Button,
    Scaffold
} from '@src/components';
import { CurrentRenderContext } from '@react-navigation/native';
import { Container, Divider } from 'src/styled';
import imageAssets from 'assets/images';
import HtmlView from 'src/components/HtmlView';

const FAQScreen = ({navigation}) => {
    const {Color} = useColor();
    const [activeSections, setActiveSections] = useState([]);

    return (
        <Scaffold
            headerTitle='Syarat & Ketentuan'
        >
            <ScrollView>
                <Container padding={16}>
                    <Accordion
                        sections={[
                        {
                            title: 'Pengembalian Tiket',
                            content: '',
                            imageAsset: imageAssets.ticketRefund,
                        },
                        {
                            title: 'Syarat & Ketentuan',
                            content: '',
                            imageAsset: imageAssets.terms,
                        },
                        ]}
                        activeSections={activeSections}
                        renderHeader={(section) => (
                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', height: 40, width: '100%', borderColor: Color.border, backgroundColor: Color.theme, borderTopWidth: 0.5, alignSelf: 'center' }}
                        >
                            <Image
                            source={section.imageAsset}
                            style={{
                                width: 14,
                                height: 10,
                                marginRight: 12,
                                tintColor: Color.textSoft,
                            }}
                            />
                            <View style={{ flex: 1 }}>
                            <Text size={12} style={{ fontWeight: '500', textAlign: 'left' }}>{section.title}</Text>
                            </View>
                            <MaterialIcons name={'keyboard-arrow-down'} size={18} color={Color.text} />
                        </View>
                        )}
                        renderContent={(section) => (
                        <Container paddingVertical={8}>
                            {/* <Text align='left' size={12}>{section.content}</Text> */}
                            <HtmlView
                                html={section.content}
                            />
                        </Container>
                        )}
                        onChange={(val) => {
                        setActiveSections(val);
                        }}
                    />
                </Container>
            </ScrollView>
        </Scaffold>
    );
}

export default FAQScreen;