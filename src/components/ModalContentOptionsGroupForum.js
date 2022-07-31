import React, { useRef, forwardRef, useState } from 'react';

import { useColor } from '@src/components';
import { useCombinedRefs } from '@src/hooks';
import ModalListAction from './Modal/ModalListAction';
import ModalInputText from '@src/components/ModalInputText';
import { useNavigation } from '@react-navigation/native';
import { Alert } from './Modal/Alert';
import { accessClient } from 'src/utils/access_client';
import { queryProductReport, queryUserBlock } from '@src/lib/query';
import Client from '@src/lib/apollo';
import { View, Image, ScrollView, FlatList, Row } from 'react-native';
import Text from '@src/components/Text';
import { fetchGroupMemberManage } from 'src/api/forum/group-member-manage';

const defaultProps = {
  callback: () => {},
  onClose: () => {},
};

const initialMessage = {
  text: '',
  status: false,
}

const ModalContentOptionsGroupForum = forwardRef((props, ref) => {
  const { selectedMember, callback, onClose } = props;

  console.log('ini props', props)

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);
  const navigation = useNavigation();
  const { Color } = useColor();

  const [modalInputText, setModalInputText] = useState(false);
  const [message, setMessage] = useState(initialMessage);

  const onMemberManage = async(status, type) => {
    const result = await fetchGroupMemberManage({
      userId: selectedMember.userId,
      status,
      groupId: selectedMember.groupId,
      type,
    });

    console.log('result', result);

    callback(result);

    if (result.status) {
      alert('Berhasil');
    } else {
      alert(result.message);
    }
  }

  console.log('selectedMember', selectedMember);

  let dataOptions = [];

  if (selectedMember) {
    if (['MEMBER', null].includes(selectedMember.type)) {
      dataOptions.push({
        name: 'Jadikan Moderator',
        color: Color.text,
        onPress: () => {
          combinedRef.current.close();
          Alert('Konfirmasi', 'Jadikan member sebagai moderator group?', () => onMemberManage(1, 'MODERATOR'))
        },
      });
    }

    if (['MODERATOR'].includes(selectedMember.type)) {
      dataOptions.push({
        name: 'Turunkan ke Member',
        color: Color.text,
        onPress: () => {
          combinedRef.current.close();
          Alert('Konfirmasi', 'Jadikan moderator sebagai mmember group?', () => onMemberManage(1, 'MEMBER'))
        },
      })
    }

    dataOptions.push({
      id: 1,
      name: 'Keluarkan dari Grup',
      color: Color.error,
      show: selectedMember ? true : false,
      onPress: () => {
        combinedRef.current.close();
        Alert('Konfirmasi', 'Hapus member dari group?', () => onMemberManage(2, 'MEMBER'))
      },
    });
  }

  return (
    <ModalListAction
      ref={combinedRef}
      data={dataOptions}
      onClose={() => onClose()}
    />
  )
});

ModalContentOptionsGroupForum.defaultProps = defaultProps;
export default ModalContentOptionsGroupForum;
