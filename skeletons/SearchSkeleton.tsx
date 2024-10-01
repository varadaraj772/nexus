import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useTheme} from 'react-native-paper';

function SearchSkeleton({direction}) {
  const {colors} = useTheme();
  return (
    <SkeletonPlaceholder
      backgroundColor={colors.background}
      highlightColor={colors.primaryContainer}
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
