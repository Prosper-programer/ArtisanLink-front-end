import React, { useState } from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/theme';

interface UserAvatarProps {
  uri?: string | null;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  showBorder?: boolean;
  borderColor?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  uri,
  size = 48,
  iconSize,
  style,
  imageStyle,
  showBorder = true,
  borderColor = Palette.outline,
}) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const calculatedIconSize = iconSize || Math.round(size * 0.52);

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: showBorder ? 1.5 : 0,
      borderColor: borderColor,
    },
    style,
  ];

  if (!uri || !uri.trim() || loadFailed) {
    return (
      <View style={[containerStyle, styles.placeholderContainer]}>
        <Ionicons
          name="person"
          size={calculatedIconSize}
          color={Palette.secondaryText}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          imageStyle,
        ]}
        onError={() => setLoadFailed(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderContainer: {
    backgroundColor: Palette.surfaceContainerLow,
  },
});

export default UserAvatar;
