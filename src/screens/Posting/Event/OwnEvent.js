import { View, Text } from 'react-native'
import React from 'react'
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct'
import { Divider } from 'src/styled'

const OwnEvent = () => {
  return (
    <View>
        <Divider/>
        <Text style={{fontSize: 14, fontWeight: 'bold', paddingHorizontal: 15}}>Event Aktif</Text>
        <Divider/>
        <HighlightContentProduct
        productCategory='EVENT'
        name='Event'
        nav='EventScreen'
        showHeader={false}
        category="MyEvent"
        />
    </View>
  )
}

export default OwnEvent