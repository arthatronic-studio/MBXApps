import React, {useEffect, useState} from 'react';
import {useWindowDimensions, Image} from 'react-native';
import {Text, useColor} from '@src/components';
import {Container} from 'src/styled';

const defaultProps = {
  url: null,
  name: 'Tribes',
  size: null,
  textSize: 18,
};

const PhotoProfile = ({url, name, size, textSize}) => {
  const {Color} = useColor();
  const {width} = useWindowDimensions();
  const sizeImage = size ? size : width * 0.12;
  const nameUser = name ? name : 'Tribes';
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [url]);

  return (
    <Container>
      {url && !error ? (
        <Image
          source={{uri: url}}
          style={{
            width: sizeImage,
            height: sizeImage,
            backgroundColor: Color.gray,
            borderRadius: sizeImage / 2,
          }}
          onError={() => setError(true)}
        />
      ) : (
        <Container
          width={sizeImage}
          height={sizeImage}
          borderRadius={sizeImage / 2}
          backgroundColor={Color.border}
          justify="center"
          align="center">
          <Text size={textSize} color={Color.black} type="bold">
            {nameUser.length > 0 ? nameUser.charAt(0).toUpperCase() : 'T'}
          </Text>
        </Container>
      )}
    </Container>
  );
};

PhotoProfile.defaultProps = defaultProps;
export default PhotoProfile;
