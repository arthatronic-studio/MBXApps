import React, { useState, useEffect, useRef } from 'react';
import { View, BackHandler } from 'react-native';
import Pdf from 'react-native-pdf';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import Share from 'react-native-share';

import { useColor } from '@src/components/Color';
import Header from '@src/components/Header';
import Text from '@src/components/Text';
import { useLoading } from '@src/components/Modal/Loading';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import { Scaffold } from 'src/components';
import Client from '@src/lib/apollo';
import { queryAddLike, queryContentProduct } from '@src/lib/query';

const PDFReaderScreen = (props) => {
    const { navigation, route } = props;
    const { params } = route;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [item, setItem] = useState(params.file ? { videoFilename: params.file } : null);

    const pdfRef = useRef().current;

    const [loadingProps, showLoading] = useLoading();
    const {Color} = useColor();

    useEffect(() => {
        if (params.item) {
            fetchContentProduct();
        }
    }, []);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        }
    }, []);
  
    const handleBackPress = () => {
        if (params.prevScreen) navigation.navigate(params.prevScreen, { refresh: true });
        else navigation.pop();
        return true;
    }

    const fetchContentProduct = () => {
        Client.query({
            query: queryContentProduct,
            variables: {
                productCode: params.item.code
            }
        })
        .then((res) => {
            console.log(res, 'res detail');
    
            if (res.data.contentProduct.length > 0) {
                setItem(res.data.contentProduct[0]);
            } else {
                setItem(params.item);
            }
        })
        .catch((err) => {
            console.log(err, 'err detail');
        });
    }

    const fetchAddLike = (id) => {
        showLoading();
    
        Client.query({
          query: queryAddLike,
          variables: {
            productId: id
          }
        })
        .then((res) => {
          console.log(res, 'res add like');

          if (res.data.contentAddLike.id) {
            let newItem = item;

            if (res.data.contentAddLike.status === 1) {
              showLoading('success', 'Disukai');
              newItem.like += 1;
              newItem.im_like = 1;
            } else {
              showLoading('info', 'Batal menyukai');
              newItem.like -= 1;
              newItem.im_like = 0;
            }

            setItem(newItem);
          } else {
            showLoading('error', 'Gagal menyukai');
          }
        })
        .catch((err) => {
            console.log(err, 'err add like');
            showLoading('error', 'Gagal menyukai');
        })
    }
    
    if (!item) return <View />;
    
    return (
        <Scaffold
            loadingProps={loadingProps}
            header={
                <Header
                    title={item.productName}
                    onPressLeftButton={() => {
                        if (params.prevScreen) navigation.navigate(params.prevScreen, { refresh: true });
                        else navigation.pop();
                    }}
                    iconRightButton={
                        !params.file && <MaterialIcons
                            name='share'
                            size={18}
                            color={Color.text}
                            onPress={async() => {
                                // const options = {
                                //     message: 'Share',
                                //     title: item.productName,
                                //     url: item.share_link,
                                // };
                                // const shareResponse = await Share.open(options);
                                // console.log(shareResponse, 'shareResponse');
                            }}
                        />
                    }
                />
            }
        >
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
                    backgroundColor: Color.theme,
                }}
                activityIndicatorProps={{
                    color: Color.primary
                }}
                page={currentPage}
                enablePaging
                // enableRTL
                spacing={8}
            />

            <View style={{flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Color.theme, paddingVertical: 16}}>
                {!params.file && <TouchableOpacity onPress={() => fetchAddLike(item.id)} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <SimpleLineIcons name='emotsmile' color={item && item.im_like ? Color.secondary : Color.text} />
                    <Text color={item && item.im_like ? Color.secondary : Color.text} style={{opacity: 0.6, marginTop: 2}}> {item.like}</Text>
                </TouchableOpacity>}
                <View>
                    <Text style={{opacity: 0.6, marginTop: 2}}>{currentPage}/{totalPage}</Text>
                </View>
                {!params.file && <TouchableOpacity onPress={() => navigation.navigate('CommentListScreen', { item, prevScreen: 'PDFReaderScreen' })} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialIcons name='comment' color={Color.text} />
                    <Text style={{opacity: 0.6, marginTop: 2}}> {item.comment}</Text>
                </TouchableOpacity>}
            </View>
        </Scaffold>
    )
}

export default PDFReaderScreen;