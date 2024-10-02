import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from 'react-native-paper';

function HomeSkeleton({direction}) {
  const {colors} = useTheme();
  return (
    <>
      <SkeletonPlaceholder
        borderRadius={1}
        backgroundColor={colors.background}
        highlightColor={colors.primaryContainer}
        direction={direction}
        speed={800}>
        <View
          style={{
            marginTop: 5,
            marginBottom: 15,
            borderRadius: 15,
            backgroundColor: '#FFF',
            paddingHorizontal: 60,
            margin: 50,
            width: 500,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#e0e0e0',
              }}
            />
            <View style={{flex: 1, marginLeft: 10}}>
              <View
                style={{
                  width: 120,
                  height: 15,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                }}
              />
              <View
                style={{
                  width: 80,
                  height: 10,
                  marginTop: 5,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                }}
              />
            </View>
          </View>
          <View
            style={{
              marginVertical: 10,
              width: '100%',
              height: 200,
              borderRadius: 15,
              backgroundColor: '#e0e0e0',
            }}
          />
          <View
            style={{
              width: '100%',
              height: 80,
              marginVertical: 5,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 5,
              paddingHorizontal: 5,
            }}>
            <View
              style={{
                width: 120,
                height: 40,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
              }}
            />
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
              }}
            />
          </View>
        </View>
      </SkeletonPlaceholder>
    </>
  );
}

export default HomeSkeleton;
