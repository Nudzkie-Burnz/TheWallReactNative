import React from 'react';
import { View } from 'react-native';
import colors from '../config/colors';

function ItemSeparator(props) {
    return (
        <View style={{width: "100%", height: 1, backgroundColor: colors.separator}}></View>
    );
}

export default ItemSeparator;