import React from 'react';
import {Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function HomeSkeleton({direction}) {
  return (
    <>
      <SkeletonPlaceholder
        borderRadius={1}
        backgroundColor="#f2f2f2"
        highlightColor="#F0E7FF"
        speed={700}
        direction={direction}>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <View
            style={{
              width: 350,
              height: 200,
              borderRadius: 50,
              marginTop: 10,
            }}
          />
          <View>
            <Text style={{marginTop: 6, fontSize: 14, lineHeight: 18}}>
              Hello world
            </Text>
          </View>
        </View>
      </SkeletonPlaceholder>
    </>
  );
}

export default HomeSkeleton;
