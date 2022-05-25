import React, {useRef, forwardRef, useState} from 'react';

import {useColor} from '@src/components';
import {useCombinedRefs} from '@src/hooks';
import ModalListAction from './Modal/ModalListAction';
import {useNavigation} from '@react-navigation/native';
import {Alert} from './Modal/Alert';
import {accessClient} from 'src/utils/access_client';
import {queryProductReport, queryUserBlock} from '@src/lib/query';
import Client from '@src/lib/apollo';

const defaultProps = {
  isOwner: false,
  item: null,
  nameType: 'PRODUCT',
  moduleType: 'CREATE',
  useBlockUser: false,
  onClose: () => {},
};

const ModalContentOptions = forwardRef((props, ref) => {
  const { isOwner, item, useBlockUser, moduleType, nameType, onClose } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const navigation = useNavigation();

  const {Color} = useColor();

  const fetchProductReportCheck = () => {
    const variables = {
      referenceId: item.id,
      referenceType: nameType,
      manageType: moduleType
    };

    console.log('variables', variables);

    Client.mutate({
      mutation: queryProductReport,
      variables,
    })
      .then(res => {
        console.log("res report",res)
        alert(
          'Laporan terkirim, Terima kasih telah membantu kami melakukan report',
        );
      })
      .catch(err => {
        console.log('error', err);
        alert('terjadi kesalahan, silakan coba beberapa saat');
      });
  };

  const fetchBlockUser = () => {
    const variables = {
      blockUserId: item.ownerId,
    };

    Client.mutate({
      mutation: queryUserBlock,
      variables,
    })
      .then(res => {
        console.log("res block", res)
        alert(
          'User di blok',
        );
      })
      .catch(err => {
        console.log('error', err);
        alert('terjadi kesalahan, silakan coba beberapa saat');
      });
  }

  const dataOptions = [
    {
      id: 0,
      show: isOwner ? true : false,
      name: 'Edit',
      color: Color.text,
      onPress: () => {
        combinedRef.current.close();
        navigation.navigate('EditThreadScreen', {
          ...item,
          title: 'Edit',
        });
      },
    },
    {
      id: 1,
      name: 'Report',
      color: Color.error,
      onPress: () => {
        combinedRef.current.close();
        Alert('Report', 'Laporkan postingan ini?', () => {
          fetchProductReportCheck();
        });
      },
    },
  ];

  if (useBlockUser) {
    dataOptions.push({
      id: 2,
      name: 'Block User',
      color: Color.error,
      onPress: () => {
        combinedRef.current.close();
        Alert(
          'Block',
          'Apakah Anda yakin akan memblok semua postingan user ini?',
          () => fetchBlockUser()
        );
      },
    });
  }

  return <ModalListAction ref={combinedRef} data={dataOptions} onClose={() => onClose()} />;
});

ModalContentOptions.defaultProps = defaultProps;
export default ModalContentOptions;
