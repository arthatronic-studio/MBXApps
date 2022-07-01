import React, {useRef, forwardRef, useState} from 'react';

import {useColor} from '@src/components';
import {useCombinedRefs} from '@src/hooks';
import ModalListAction from './Modal/ModalListAction';
import ModalInputText from '@src/components/ModalInputText';
import {useNavigation} from '@react-navigation/native';
import {Alert} from './Modal/Alert';
import {accessClient} from 'src/utils/access_client';
import {queryProductReport, queryUserBlock} from '@src/lib/query';
import Client from '@src/lib/apollo';
import {View, Image, ScrollView,FlatList,Row} from 'react-native';
import Text from '@src/components/Text';
const defaultProps = {
  isOwner: false,
  item: null,
  nameType: 'PRODUCT',
  moduleType: 'CREATE',
  onClose: () => {},
};

const initialMessage = {
  text: '',
  status: false,
}

const ModalContentOptionsGroupForum = forwardRef((props, ref) => {
  const { isOwner, item, moduleType, nameType, onClose } = props;

  console.log('ini props',props)

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const navigation = useNavigation();
  const {Color} = useColor();

  const [modalInputText, setModalInputText] = useState(false);
  const [message, setMessage] = useState(initialMessage);

  const fetchProductReportCheck = (text) => {
    if (!item) {
      setMessage({
        ...message,
        text: 'Konten tidak tersedia',
      });
      setTimeout(() => {
        setMessage(initialMessage);
      }, 3000);
      return;
    }

    const variables = {
      referenceId: item.id,
      referenceType: nameType,
      referenceName: item.productName,
      refStatus: item.status,
      reportMessage: text,
    };

    console.log('variables', variables);

    Client.mutate({
      mutation: queryProductReport,
      variables,
    })
      .then(res => {
        console.log("res report", res);
        setMessage({
          ...message,
          status: true,
          text: 'Laporan terkirim, Terima kasih telah membantu kami melakukan report'
        });
        setTimeout(() => {
          setMessage(initialMessage);
          setModalInputText(false);
          combinedRef.current.close();
        }, 3000);
      })
      .catch(err => {
        console.log('error', err);
        setMessage({
          ...message,
          text: 'Terjadi kesalahan, silakan coba beberapa saat'
        });
        setTimeout(() => {
          setMessage(initialMessage);
          setModalInputText(false);
          combinedRef.current.close();
        }, 3000);
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
      name: 'Jadikan Moderator',
      color: Color.text,
      onPress: () => {
       
        
      },
    },
    {
      id: 1,
      name: 'Keluarkan dari Group',
      color: Color.error,
      onPress: () => {
       
        
      },
    },
    {
      id: 2,
      name: 'Report',
      color: Color.error,
      onPress: () => {
       
        
      },
    },
  ];

 

  return (
    <>
    
      <ModalListAction
        ref={combinedRef}
        data={dataOptions}
        onClose={() => onClose()}
      />
      
     
    </>
  )
});

ModalContentOptionsGroupForum.defaultProps = defaultProps;
export default ModalContentOptionsGroupForum;
