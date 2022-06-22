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

const defaultProps = {
  isOwner: false,
  item: null,
  nameType: 'PRODUCT',
  moduleType: 'CREATE',
  useBlockUser: false,
  onClose: () => {},
  editScreen: "EditThreadScreen",
};

const initialMessage = {
  text: '',
  status: false,
}

const ModalContentOptions = forwardRef((props, ref) => {
  const { isOwner, item, useBlockUser, moduleType, nameType, onClose, editScreen } = props;

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
      manageType: moduleType,
      message: text,
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
      show: isOwner ? true : false,
      name: 'Edit',
      color: Color.text,
      onPress: () => {
        combinedRef.current.close();
        navigation.navigate(editScreen, {
          ...item,
          title: 'Edit',
        });
      },
    },
    {
      id: 1,
      name: 'Bagikan',
      color: Color.text,
      onPress: () => {
        
      },
    },
    {
      id: 2,
      name: 'Report',
      color: Color.error,
      onPress: () => {
        combinedRef.current.close();
        navigation.navigate('ReportArticle')
      },
    },
    {
      id: 3,
      name: 'Hapus',
      color: Color.error,
      onPress: () => {
        
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

  return (
    <>
      <ModalListAction
        ref={combinedRef}
        data={dataOptions}
        onClose={() => onClose()}
      />
      
      <ModalInputText
        visible={modalInputText}
        headerLabel='Alasan Anda melaporkan konten'
        placeholder='Masukan alasan Anda'
        isTextArea
        onClose={() => setModalInputText(false)}
        onSubmit={(text) => {
          Alert('Report', 'Laporkan postingan ini?', () => {
            fetchProductReportCheck(text);
          });
        }}
        successMessage={message.status ? message.text : ''}
        errorMessage={message.status ? '' : message.text}
      />
    </>
  )
});

ModalContentOptions.defaultProps = defaultProps;
export default ModalContentOptions;
