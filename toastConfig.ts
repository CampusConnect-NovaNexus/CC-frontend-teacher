// toastConfig.ts
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

export const toastConfig = {
  customConfirm: ({ text1, text2, props }: any) => (
    <View className="bg-white p-4 rounded-lg shadow-md w-[90%] self-center">
      <Text className="font-bold text-lg text-gray-800">{text1}</Text>
      <Text className="text-gray-500 mb-4">{text2}</Text>
      <View className="flex-row justify-end space-x-2">
        {props?.buttons?.map((btn: any, idx: number) => (
          <TouchableOpacity
            key={idx}
            onPress={btn.onPress}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            <Text className="text-gray-800">{btn.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
};
