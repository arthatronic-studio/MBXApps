import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, Image, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';

import Text from '@src/components/Text';
import { useColor } from '@src/components';
import TouchableOpacity from '@src/components/Button/TouchableDebounce';
import Loading, { useLoading } from  '@src/components/Modal/Loading';

import Client from '@src/lib/apollo';
import { queryMaudiAddComment } from '@src/lib/query';
import { shadowStyle } from '@src/styles';

const defaultProps = {
    data: [],
    loading: false,
    showAll: false,
    onSuccessComment: () => {},
    onPressShowAll: () => {},
    onPressDots: () => {},
}

const CardListComment = (props) => {
    const { data, item, title, loading, showAll, onSuccessComment, onPressShowAll, onPressDots } = props;

    // dispatch
    const dispatch = useDispatch();

    // selector
    const user = useSelector(
      state => state['user.auth'].login.user
    );

    const [listComment, setListComment] = useState();
    const [textComment, setTextComment] = useState('');

    const [loadingProps, showLoading] = useLoading();
    const { Color } = useColor();

    useEffect(() => {
      const maxLengthData = data.length <= 3 ? data.length : 3;

      let newListComment = [];
      for (let i = 0; i < maxLengthData; i++) {
        newListComment.push(data[i]);
      }
      
      setListComment(newListComment);
    }, [data]);

    const submitComment = () => {
        if (textComment === '') {
          alert('Isi komentar tidak boleh kosong');
          return;
        }

        const variables = {
            productId: item.id,
            comment: textComment,
        };

        console.log(variables, 'variables');
        
        Client.query({
            query: queryMaudiAddComment,
            variables
          })
          .then((res) => {
            console.log(res, 'res add comm');
            
            if (res.data.maudiAddComment.id) {
              const arrNew = [res.data.maudiAddComment].concat(listComment);
            
              setTextComment('');
              setListComment(arrNew);
              onSuccessComment(res.data.maudiAddComment.productId);
            } else {
              showLoading('error', 'Gagal mengirimkan komentar');
            }
          })
          .catch((err) => {
              console.log(err, 'err add comm');
              showLoading('error', 'Gagal mengirimkan komentar');
          })
    }

    return (
        <View style={{backgroundColor: Color.theme}}>
          <View style={{paddingHorizontal: 16}}>
            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12}}>
                <Text size={12}>{title}</Text>
                {showAll && <Text onPress={() => onPressShowAll()} size={12} color={Color.primary}>Lihat Semua</Text>}
            </View>

            <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{width: '100%', borderRadius: 4, justifyContent: 'center', backgroundColor: Color.textInput, ...shadowStyle}}>
                  <TextInput
                    placeholder='Tulis Komentar..'
                    placeholderTextColor={Color.text}
                    style={{
                      fontSize: 12,
                      fontFamily: 'Raleway-Regular',
                      color: Color.text,
                      paddingVertical: 8,
                      paddingLeft: 8,
                      paddingRight: 40,
                      minHeight: 45,
                    }}
                    value={textComment}
                    multiline
                    onChangeText={(e) => setTextComment(e)}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      submitComment();
                    }}
                    style={{width: 40, height: 40, position: 'absolute', bottom: 2, right: 4, alignItems: 'center', justifyContent: 'center'}}
                  >
                    <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center'}}>
                      <Ionicons name='arrow-forward' color={Color.theme} size={18} />
                    </View>
                  </TouchableOpacity>
              </View>
            </View>
          </View>

          {loading ?
            <ActivityIndicator size='large' color={Color.secondary} style={{marginTop: 16}} />
          :
            <FlatList
              keyExtractor={(item, index) => item.toString() + index}
              data={listComment}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
              renderItem={({ item, index }) => {
                  const canManageComment = user && !user.guest && user.userId === item.userId;
                
                  return (
                    <View style={[{width: '100%', flexDirection: 'row', marginBottom: 2, paddingVertical: 8, paddingRight: 16, paddingLeft: 8, borderBottomWidth: 0.5, borderColor: Color.border}, index === 0 && {marginTop: 4} ]}>
                          <View style={{width: '15%', alignItems: 'center', paddingTop: 4}}>
                              <Image source={{ uri: item.image }} style={{width: 30, height: 30, borderRadius: 15, backgroundColor: Color.primary}} />
                          </View>
                          <View style={{width: '80%'}}>
                              <View>
                                  <Text size={12} align='left' style={{opacity: 0.75}}>{item.fullname}</Text>
                                  <View style={{width: 4}} />
                                  <Text size={10} align='left' style={{opacity: 0.75}}>{Moment(parseInt(item.commentDate)).format('dddd, HH:mm - DD/MM/YYYY')}</Text>
                              </View>
                              
                              <Text size={12} align='left' type='medium'>{item.comment}</Text>
                          </View>
                          {canManageComment && <TouchableOpacity onPress={() => onPressDots()} style={{height: 30, width: '5%', alignItems: 'center', justifyContent: 'center'}}>
                              <Entypo name='dots-three-vertical' />
                          </TouchableOpacity>}
                      </View>
                  )
              }}
          />}

          <Loading {...loadingProps} />
        </View>
    )
}

CardListComment.defaultProps = defaultProps;

export default CardListComment;