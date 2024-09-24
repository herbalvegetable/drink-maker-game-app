import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
} from 'react-native';

export default function Drink(props) {
    const { layers } = props;
    return (
        <View style={styles.drink}>
            {/* {
              currentLayers.length > 1 ?
                <LinearGradient
                  colors={currentLayers.map(layer => layer.colour)}
                  style={styles.currentLayers}
                />
                :
                currentLayers.length == 1 ?

                  <View style={{
                    backgroundColor: currentLayers[0].colour,
                    ...styles.currentLayers,
                  }}>

                  </View>

                  :

                  null
            } */}
            <View style={styles.currentLayers}>
                {
                    layers.map((layer, layerIndex) => {
                        const { colour } = layer;
                        return <View
                            key={layerIndex.toString()}
                            style={{
                                backgroundColor: colour,
                                height: `${100 / layers.length}%`,
                                ...styles.currentLayer,
                            }}>

                        </View>
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    drink: {
        width: '100%',
        height: '100%',
        borderWidth: 4,
        borderTopWidth: 0,
        borderColor: 'skyblue',
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    currentLayers: {
        width: '100%',
        height: '93%',
    },
    currentLayer: {
        width: '100%',
    },
});