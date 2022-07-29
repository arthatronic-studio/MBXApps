import React, { useRef, forwardRef, useState } from 'react';

import { useColor } from '@src/components';
import { useCombinedRefs } from '@src/hooks';
import ModalListAction from './Modal/ModalListAction';
import ModalInputText from '@src/components/ModalInputText';
import { useNavigation } from '@react-navigation/native';
import { Alert } from './Modal/Alert';
import { accessClient } from 'src/utils/access_client';
import { queryProductManage, queryProductReport, queryUserBlock } from '@src/lib/query';
import Client from '@src/lib/apollo';

const defaultProps = {
  isOwner: false,
  item: null,
  nameType: 'PRODUCT',
  moduleType: 'CREATE',
  onClose: () => { },
};

const initialMessage = {
  text: '',
  status: false,
}

const ModalContentOptions = forwardRef((props, ref) => {
  const { isOwner, item, moduleType, nameType, onClose } = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const navigation = useNavigation();
  const { Color } = useColor();

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

  const onUpdateContentStatus = (item, status) => {
    // showLoading();

    let objProduct = {
      code: item.code,
      name: item.productName,
      status,
      method: 'UPDATE',
      type: item.productType,
      category: item.productCategory,
      description: item.productDescription,
    };

    let variables = {
        products: [objProduct],
    };

    console.log(variables, 'variables');
    
    Client.query({
        query: queryProductManage,
        variables,
    })
    .then((res) => {
        console.log(res, '=== Berhsail ===');
        if (Array.isArray(res.data.contentProductManage) && res.data.contentProductManage.length > 0 && res.data.contentProductManage[0] && res.data.contentProductManage[0].id) {
          alert('Berhasil');
        } else {
          alert('Gagal menghapus konten');
        }
        // showLoading('success', 'Berhasil!');

        // setTimeout(() => {
        //     // navigation.navigate('ForumSegmentScreen', { ...params, componentType: 'LIST', refresh: true });
        //     // navigation.popToTop();
        // }, 2500);
    })
    .catch((err) => {
        console.log(err, 'errrrr');
        // showLoading('error', 'Gagal, Harap ulangi kembali');
        alert('Gagal, Harap ulangi kembali');
    });
  }

  const showForOwner = isOwner ? true : false;
  const showForOther = isOwner ? false : true;

  const dataOptions = [
    {
      id: 0,
      show: showForOwner,
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
      show: showForOther,
      name: 'Simpan Postingan',
      color: Color.text,
      onPress: () => {
        
      },
    },
    // {
    //   id: 1,
    //   name: 'Bagikan',
    //   color: Color.text,
    //   onPress: () => {
    //     combinedRef.current.close();
    //   },
    // },
    {
      id: 3,
      name: 'Report',
      show: showForOther,
      color: Color.error,
      onPress: () => {
        combinedRef.current.close();
        if (moduleType === 'FORUM') {
          navigation.navigate('ForumReport', { item });
        } else {
          setModalInputText(true);
        }
      },
    },
  ];
  
  if (showForOwner) {
    dataOptions.push({
      id: 2,
      name: 'Hapus',
      color: Color.error,
      onPress: () => {
        combinedRef.current.close();
        Alert(
          'Hapus',
          'Apakah Anda yakin akan memnghapus postingan ini?',
          () => onUpdateContentStatus(item, 'REMOVE'),
        );
      },
    });
  }

  if (showForOther) {
    dataOptions.push({
      id: 4,
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
