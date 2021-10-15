import React, { useState, useRef } from 'react';
import { View, Modal } from 'react-native';
import Styled from 'styled-components';
import Pdf from 'react-native-pdf';

import { useColor } from '@src/components';
import Header from '@src/components/Header';
import Text from '@src/components/Text';

const MainView = Styled(View)`
    flex: 1;
`;

const defaultProps = {
    visible: false,
    onClose: () => {},
};

const ModalShowPDF = (props) => {
    const {
        visible, onClose, item,
    } = props;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const { Color } = useColor();

    const pdfRef = useRef().current;
    
    if (!item) return <View />;
    
    return (
        <Modal
            visible={visible}
            onRequestClose={() => onClose()}
            animationType='slide'
        >
            <MainView>
                <Header
                    title={item.productName}
                    color={Color.theme}
                    onPressLeftButton={() => onClose()}
                />
                <View>
                    <Text style={{opacity: 0.6}}>{currentPage}/{totalPage}</Text>
                </View>
                <Pdf
                    ref={pdfRef}
                    source={{
                        uri: item.videoFilename,
                        cache: true
                    }}
                    onLoadProgress={(percent) => {
                        console.log(`load progress: ${percent}`);
                    }}
                    onLoadComplete={(numberOfPages, filePath)=>{
                        setTotalPage(numberOfPages);
                    }}
                    onPageChanged={(page, numberOfPages)=>{
                        setCurrentPage(page);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    onPressLink={(uri)=>{
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={{
                        flex: 1,
                        backgroundColor: '#FFFFFF',
                    }}
                    activityIndicatorProps={{
                        color: Color.primary
                    }}
                    page={currentPage}
                    enablePaging
                    enableRTL
                    spacing={8}
                />
            </MainView>
        </Modal>
    )
}

ModalShowPDF.defaultProps = defaultProps;

export default ModalShowPDF;