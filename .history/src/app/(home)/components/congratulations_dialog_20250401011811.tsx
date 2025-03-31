import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native'
import LottieView from 'lottie-react-native'
import { useAssets } from 'expo-asset'

interface CongratulationsDialogProps {
  visible: boolean
  onClose: () => void
//   confettiSource: any // Path to your Lottie JSON file
}

export const CongratulationsDialog = ({ 
  visible, 
  onClose,
//   confettiSource 
}: CongratulationsDialogProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const lottieRef = useRef<LottieView>(null)
  
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
      
      // Play confetti animation
      if (lottieRef.current) {
        lottieRef.current.play()
      }
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

  const conf = useAssets[(require('~/assets/lottie/confetti.json'))]
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <LottieView
  ref={lottieRef}
  source={conf} // ✅ Directly require the file
  style={{
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  }}
  loop={false}
  autoPlay={true} // Ensure it plays when the dialog opens
/>

        
        <Animated.View 
          className="bg-[#1E1E30] rounded-2xl p-6 mx-6 items-center"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <View className="w-16 h-16 bg-[#8A7CFF]/20 rounded-full items-center justify-center mb-4">
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
            className="bg-[#8A7CFF] rounded-full py-3 px-8 w-full"
          >
            <Text className="text-white font-sans-semibold text-center">
              Start Sleeping Better
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onClose}
            className="mt-4"
          >
            <Text className="text-[#8A7CFF] font-sans-medium">
              Close
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}
