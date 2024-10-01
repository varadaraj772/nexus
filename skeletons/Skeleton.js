/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from 'react-native-paper';

const Skeleton = () => {
  const {colors} = useTheme();
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      enabled={true}
      direction="right"
      backgroundColor={colors.background}
      highlightColor={colors.primaryContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
        <View
          key={index}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: '5%',
            gap: 10,
            paddingHorizontal: '4%',
          }}>
          <View style={{width: 60, height: 60, borderRadius: 60}} />

          <View style={{gap: 5}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{width: 100, height: 20}} />

              <View style={{width: 100, height: 30, borderRadius: 30}} />
            </View>

            <View style={{width: 100, height: 10}} />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{width: 100, height: 10}} />

              <View style={{width: 100, height: 10, marginLeft: '25%'}} />
            </View>
          </View>
        </View>
      ))}
    </SkeletonPlaceholder>
  );
};

export default Skeleton;
