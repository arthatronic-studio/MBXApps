import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import ImagesPath from '../../components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  useColor,
} from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { shadowStyle } from 'src/styles';
import { queryGetProduct } from 'src/lib/query/ecommerce';
import Client from 'src/lib/apollo';
import { FormatMoney } from 'src/utils';
import CardEcomerceProduct from 'src/screens/Ecommerce/CardEcomerceProduct';
import { initialItemState, statusBarHeight } from 'src/utils/constants';
import SearchBar from 'src/components/SearchBar';

const itemPerPage = 6;

const ListProduct = (props) => {
  const [dataProduk, setDataProduk] = useState(initialItemState);
  const [searchProduk, setSearchProduk] = useState(initialItemState);
  const [searchText, setSearchText] = useState('');

  const { Color } = useColor();
  const { height, width } = useWindowDimensions();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (dataProduk.loadNext && dataProduk.page !== -1) {
        fetchProduct();
    }
  }, [dataProduk.loadNext]);

  useEffect(() => {
    if (searchProduk.loadNext && searchProduk.page !== -1) {
        fetchSearchProduct();
    }
  }, [searchProduk.loadNext]);

  useEffect(() => {
    const timeout = searchText !== '' ?
        setTimeout(() => {
            setSearchProduk({ ...searchProduk, refresh: true });
        }, 1000) : null;

    return () => {
        clearTimeout(timeout);
    }
  }, [searchText]);

  useEffect(() => {
    if (searchProduk.refresh) {
        fetchSearchProduct();
    }
  }, [searchProduk.refresh]);

  const fetchProduct = () => {
    let variables = {
        page: dataProduk.page + 1,
        itemPerPage,
        name: searchText
    }

    console.log(variables);

    Client.query({query: queryGetProduct, variables})
    .then(res => {
        console.log(res);

        const data = res.data.ecommerceProductList;
        let newData = [];
        if (Array.isArray(data)) {
            newData = data;
        }

        setDataProduk({
            ...dataProduk,
            data: dataProduk.data.concat(newData),
            page: newData.length === itemPerPage ? dataProduk.page + 1 : -1,
            loading: false,
            loadNext: false,
            refresh: false,
        });
    })
    .catch(reject => {
        console.log(reject);

        setDataProduk({
            ...dataProduk,
            loading: false,
            loadNext: false,
            refresh: false,
        });
    });
  }

  const fetchSearchProduct = () => {
    let variables = {
        page: searchProduk.page + 1,
        itemPerPage,
        name: searchText
    }

    console.log(variables);

    Client.query({query: queryGetProduct, variables})
    .then(res => {
        console.log(res);

        const data = res.data.ecommerceProductList;
        let newData = [];
        if (Array.isArray(data)) {
            newData = data;
        }

        setSearchProduk({
            ...searchProduk,
            data: searchProduk.refresh ? newData : searchProduk.data.concat(newData),
            page: newData.length === itemPerPage ? searchProduk.page + 1 : -1,
            loading: false,
            loadNext: false,
            refresh: false,
        });
    })
    .catch(reject => {
        console.log(reject);

        setSearchProduk({
            ...searchProduk,
            loading: false,
            loadNext: false,
            refresh: false,
        });
    });
  }

  const onEndReached = () => {
    if (searchText !== '') {
      setSearchProduk({ ...searchProduk, loadNext: true });
    } else {
      setDataProduk({ ...dataProduk, loadNext: true });
    }
  }

  return (
    <>
      {/* hide category */}
      {/* <FlatList
        showsHorizontalScrollIndicator={false}
        style={{ height: 35, marginHorizontal: 20 }}
        data={[
          { kategori: 'Semua Produk' },
          { kategori: 'Fashion' },
          { kategori: 'Gadget' },
          { kategori: 'Semua Produk' },
          { kategori: 'Frozen Food' },
          { kategori: 'Electronics' },
        ]}
        horizontal
        renderItem={({ item }) =>
          <TouchableOpacity style={{ borderRadius: 20, justifyContent: 'center', alignItems: 'center', width: 90, height: 30, borderWidth: 1, borderColor: Color.secondary, marginHorizontal: 5 }}>
            <Text style={{ fontSize: 10 }}>{item.kategori}</Text>
          </TouchableOpacity>
        }
      /> */}

      <SearchBar
        type='input'
        value={searchText}
        onChangeText={(val) => setSearchText(val)}
      />

      <FlatList
        style={{ marginVertical: 10, }}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        data={searchText !== '' ? searchProduk.data : dataProduk.data}
        onEndReachedThreshold={0.3}
        onEndReached={() => onEndReached()}
        renderItem={({ item, index }) => <CardEcomerceProduct item={item} index={index} />}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: statusBarHeight,
        }}
      />
    </>
  );
};

export default ListProduct;