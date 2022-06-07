import { View, Text } from 'react-native'
import React from 'react'
import { Scaffold, Header, useColor } from 'src/components'
import ListContentProduct from 'src/components/Content/ListContentProduct';
const Saved = ({navigation, route}) => {
    const { Color } = useColor();
    // const { title, userProfileId } = route.params;
  return (

    <Scaffold
        style={{backgroundColor: Color.border}}
		header={<Header customIcon title="Artikel Tersimpan" type="regular" centerTitle={false} />}
		onPressLeftButton={() => navigation.pop()}
	>
        <ListContentProduct
          productCategory='POSTING'
          name='Artikel'
        />
    </Scaffold>
  )
}

export default Saved