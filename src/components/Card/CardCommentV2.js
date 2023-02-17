import React, {useState, useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';

import Text from '@src/components/Text';
import {useColor} from '@src/components';
import {Container, Divider, Row} from 'src/styled';
import {useNavigation} from '@react-navigation/native';
import PhotoProfile from '../PhotoProfile';
import moment from 'moment/moment';
import {fetchLike} from 'src/api-rest/fetchLike';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';

const defaultProps = {
  itemComment: {},
  style: {},
  onPress: null,
  onPressDots: () => {},
  category: 'picu_wujudkan',
};

const CardCommentV2 = ({itemComment, style, onPress, type, onPressDots, category}) => {
  const {Color} = useColor();
  const navigation = useNavigation();
  const auth = useSelector(state => state['auth']);

  const [like, setLike] = useState(
    itemComment.like_comment_count ? itemComment.like_comment_count : 0,
  );
  const [isLike, setIsLike] = useState(itemComment.is_liked);

  const onSubmitLike = async () => {
    const body = {
      type: type + '_comment',
      category: category,
      parent_id: itemComment.id,
    };
    const res = await fetchLike(body);
    console.log(body, 'body nih', res)
    if (res.success) {
      setLike(!isLike ? like + 1 : like - 1);
      setIsLike(!like);
    }
  };

  return (
    <Container padding={10} flexDirection="row" style={{...style}}>
      <PhotoProfile
        url={itemComment?.user?.foto}
        name={itemComment?.user?.name}
        size={32}
        textSize={14}
      />
      <Container
        flex={1}
        flexDirection="column"
        marginLeft={6}
        align="flex-start">
        <Text size={14} lineHeight={16} type="medium" color={Color.text}>
          {itemComment?.user?.name}
        </Text>
        <Divider height={8} />
        <Text size={12} lineHeight={14} color={Color.text}>
          {itemComment.message}
        </Text>
        <Divider height={8} />
        <Container flexDirection="row" justifyContent="space-between">
          <Container flexDirection="row" flex={1}>
            <TouchableOpacity onPress={() => onSubmitLike()}>
              <Text size={12} lineHeight={14} color={Color.text}>
                {like} Suka
              </Text>
            </TouchableOpacity>
            <Divider width={10} />
            {onPress && (
              <TouchableOpacity onPress={() => onPress()}>
                <Text size={12} lineHeight={14} color={Color.text}>
                  Balas
                </Text>
              </TouchableOpacity>
            )}
          </Container>
          <Text size={12} lineHeight={14} color={Color.text}>
            {moment(itemComment.created_at).fromNow()}
          </Text>
        </Container>
      </Container>
      {auth.user.id === itemComment.user.id && (
        <TouchableOpacity onPress={() => onPressDots(itemComment)}>
          <Entypo name={'dots-three-vertical'} color={Color.text} size={14} />
        </TouchableOpacity>
      )}
    </Container>
  );
};

CardCommentV2.defaultProps = defaultProps;
export default CardCommentV2;
