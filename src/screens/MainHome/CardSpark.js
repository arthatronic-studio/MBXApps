import React, {useState, useEffect} from 'react';
import {
  View,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';

import {Text, useColor} from '@src/components';
import {Container, Divider} from 'src/styled';
import {fetchGetArticle} from 'src/api-rest/fetchGetArticle';
import HtmlView from 'src/components/HtmlView';

const CardSpark = ({}) => {
  const {width} = useWindowDimensions();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const Color = useColor();

  const fetchData = async () => {
    const result = await fetchGetArticle('?type=kutipan');
    if (result.status) {
      setData(result.data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container paddingHorizontal={16} paddingTop={11} paddingBottom={11}>
      {loading ? (
        <View
          style={{
            width: width,
            aspectRatio: 16 / 9,
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              flex: 1,
              width: '100%',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color={Color.primary} />
            <Divider />
            <Text>Memuat</Text>
          </View>
        </View>
      ) : (
        <>
          <HtmlView html={data?.title} />
          <Divider height={4} />
          <Text size={11} type="medium" align="left">
            {data?.publisher}
          </Text>

          <Divider height={11} />

          <HtmlView html={data?.subtitle} />
        </>
      )}
    </Container>
  );
};

export default CardSpark;
