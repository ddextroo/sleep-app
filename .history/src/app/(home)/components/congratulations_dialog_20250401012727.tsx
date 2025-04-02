import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native'

interface CongratulationsDialogProps {
  visible: boolean
  onClose: () => void
}

export const CongratulationsDialog = ({ 
  visible, 
  onClose,
//   confettiSource 
}: CongratulationsDialogProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  
  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start()
      
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [visible, fadeAnim, scaleAnim])

  if (!visible) return null

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <Animated.View 
          className="bg-[#1E1E30] rounded-2xl p-10 mx-6 items-center"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <View className="w-30 h-30 bg-[#1E1E30] rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">🎉</Text>
          </View>
          
          <Text className="text-white font-sans-bold text-2xl mb-2 text-center">
            Congratulations!
          </Text>
          
          <Text className="text-gray-300 font-sans text-center mb-6">
            You've learned all the tips for better sleep. Put these methods into practice for a more restful night.
          </Text>
          
          <TouchableOpacity
            onPress={onClose}
            className="bg-[#8A7CFF] rounded-md py-3 px-8 w-full"
          >
            <Text className="text-white font-sans-semibold text-center">
              Start Sleeping Better
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}
