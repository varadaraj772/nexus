import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function SearchSkeleton({direction}) {
  return (
    <SkeletonPlaceholder
      backgroundColor="#f2f2f2"
      highlightColor="#F0E7FF"
      direction={direction}
      speed={700}>
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonProfile} />
        <View style={styles.skeletonText} />
        <View style={styles.skeletonText} />
      </View>
    </SkeletonPlaceholder>
  );
}
const styles = StyleSheet.create({
  skeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    margin: 5,
  },
  skeletonProfile: {
    width: 60,
    height: 60,
    borderRadius: 25,
  },
  skeletonText: {
    height: 40,
    width: 200,
    borderRadius: 4,
    marginLeft: 10,
  },
});
export default SearchSkeleton;
