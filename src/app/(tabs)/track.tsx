import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import {
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  StopCircle,
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react-native";
import {
  startSleepTracking,
  formatDuration,
  getSleepProgress,
  getSleepDataForDate,
} from "../service/trackService";
import { BlurView } from "expo-blur";
import { getUserDetails } from "../service/authService";
import { useAssets } from "expo-asset";
import { useTrackStore } from "../store/trackStore";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

export default function TrackScreen() {
  const {
    isTracking,
    startTime,
    endTime,
    elapsedTime,
    sleepDuration,
    selectedDate,
    sleepProgress,
    previousDateData,
    userName,
    setTracking,
    setStartTime,
    setEndTime,
    setElapsedTime,
    setSleepDuration,
    setSelectedDate,
    setSleepProgress,
    setPreviousDateData,
    setUserName,
    incrementElapsedTime,
    modalVisible,
    setModalVisible,
    stopModalVisible,
    setStopModalVisible,
    isLoading,
    setIsLoading,
    isUserLoading,
    setIsUserLoading,
    isSleepDataLoading,
    setIsSleepDataLoading,
    isProgressLoading,
    setIsProgressLoading,
  } = useTrackStore();

  const intervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const circleRef = useRef(null);

  // Fetch previous date's sleep data
  useEffect(() => {
    const fetchPreviousData = async () => {
      setIsLoading(true);
      const previousDate = new Date(selectedDate);
      previousDate.setDate(previousDate.getDate() - 1);
      const data = await getSleepDataForDate(previousDate);
      setPreviousDateData(data);
      setIsLoading(false);
    };
    fetchPreviousData();
  }, [selectedDate]);

  useEffect(() => {
    if (isTracking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTracking]);

  // fetch sleep progress data
  useEffect(() => {
    const fetchSleepProgress = async () => {
      setIsProgressLoading(true);
      console.log("Fetching sleep progress...");
      const data = await getSleepProgress();
      console.log("Received sleep progress data:", data);

      if (data) {
        console.log("Sleep progress data:", data);
        setSleepProgress(data);
      }
      setIsProgressLoading(false);
    };
    fetchSleepProgress();
  }, [isTracking]);

  // sleep data for selected date
  useEffect(() => {
    const fetchSleepData = async () => {
      setIsSleepDataLoading(true);
      const data = await getSleepDataForDate(selectedDate);
      console.log("Fetched sleep data:", data);
      if (data) {
        setSleepDuration(data.duration);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
      } else {
        setSleepDuration("00:00:00");
        setStartTime(null);
        setEndTime(null);
      }
      setIsSleepDataLoading(false);
    };
    fetchSleepData();
  }, [selectedDate]);

  // fetch user data using getUserDetails
  useEffect(() => {
    const fetchUserData = async () => {
      setIsUserLoading(true);
      const userDetails = await getUserDetails();
      if (userDetails?.profile?.username) {
        setUserName(userDetails.profile.username);
      }
      setIsUserLoading(false);
    };
    fetchUserData();
  }, []);

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleConfirmTracking = () => {
    setModalVisible(false);
    startTracking();
  };

  const startTracking = () => {
    setTracking(true);
    const now = Date.now();
    setStartTime(now);
    setElapsedTime(0);

    // Start the timer
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      incrementElapsedTime();
    }, 1000);

    // start tracking in supabase
    startSleepTracking(now, null, 0);
  };

  const handleStopTracking = async () => {
    clearInterval(intervalRef.current);
    setTracking(false);
    const endTime = Date.now();
    const finalDuration = formatDuration(elapsedTime, false);
    setSleepDuration(finalDuration);
    setEndTime(endTime);
    setStopModalVisible(true);

    try {
      await startSleepTracking(startTime, endTime, elapsedTime);
      // get updated data after stop tracking
      const updatedData = await getSleepDataForDate(selectedDate);
      if (updatedData) {
        setSleepDuration(updatedData.duration);
        setStartTime(updatedData.startTime);
        setEndTime(updatedData.endTime);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigateDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    newDate.setHours(0, 0, 0, 0);

    // Allow navigation to today's date but prevent future dates
    if (newDate.getTime() <= today.getTime()) {
      setSelectedDate(newDate);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // calculate quality
  const getCurrentDaySleepHours = () => {
    if (isTracking) {
      return elapsedTime / 3600; // Convert seconds to hours
    } else if (sleepDuration === "00:00:00") {
      return 0;
    } else {
      // Parse the sleep duration string (e.g., "7m 30s" -> 0.125 hours)
      let totalHours = 0;
      const parts = sleepDuration.split(" ");

      parts.forEach((part) => {
        if (part.includes("h")) {
          totalHours += parseInt(part) || 0;
        } else if (part.includes("m")) {
          totalHours += (parseInt(part) || 0) / 60;
        } else if (part.includes("s")) {
          totalHours += (parseInt(part) || 0) / 3600;
        }
      });

      return totalHours;
    }
  };

  //100% percent will be 8 hours
  const qualityPercentage = Math.min(
    100,
    Math.round((getCurrentDaySleepHours() / 8) * 100)
  );

  // calculate progress circle
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (qualityPercentage / 100) * circumference;

  // messages based on time of day
  const getMessage = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  // sleep quality message
  const getSleepQualityMessage = (hours: number) => {
    if (hours >= 8) {
      return "Excellent sleep! You've got the perfect amount of rest.";
    } else if (hours >= 7) {
      return "Good sleep! You're well-rested.";
    } else if (hours >= 6) {
      return "Fair sleep. Try to get a bit more rest next time.";
    } else {
      return "You might want to get more sleep next time.";
    }
  };

  return (
    <LinearGradient
      colors={["#121212", "#1E1E30", "#231B36", "#1E1E30", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1 px-6">
          <View className="mt-8 mb-6 flex-row justify-between items-center">
            <Text className="text-white font-sans-bold text-3xl">
              Sleep Insights
            </Text>
          </View>

          {/* start tracking modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <BlurView
              intensity={100}
              tint="dark"
              className="flex-1 justify-center items-center"
            >
              <View className="bg-[#1E1E30] backdrop-blur-lg rounded-3xl p-8 w-4/5 items-center shadow-lg">
                <View className="bg-[#2D2D2D] p-4 rounded-full mb-6">
                  <Moon size={32} color="#8A7CFF" />
                </View>
                <Text className="text-white text-2xl font-sans-bold mb-2">
                  Start Sleep Tracking?
                </Text>
                <Text className="text-gray-300 text-center mb-6 font-sans">
                  Your sleep data will be recorded until you stop tracking
                </Text>
                <View className="flex-row space-x-4 w-full gap-4">
                  <Pressable
                    className="flex-1 bg-[#2D2D2D] rounded-xl py-4"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-white text-center font-sans-bold">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 bg-[#8A7CFF] rounded-xl py-4"
                    onPress={handleConfirmTracking}
                  >
                    <Text className="text-white text-center font-sans-bold">
                      Start
                    </Text>
                  </Pressable>
                </View>
              </View>
            </BlurView>
          </Modal>

          {/* stop tracking modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={stopModalVisible}
            onRequestClose={() => setStopModalVisible(false)}
          >
            <BlurView
              intensity={100}
              tint="dark"
              className="flex-1 justify-center items-center"
            >
              <View className="bg-[#1E1E30] backdrop-blur-lg rounded-3xl p-8 w-4/5 items-center shadow-lg">
                <View className="bg-[#2D2D2D] p-4 rounded-full mb-6">
                  <Sun size={32} color="#8A7CFF" />
                </View>
                <Text className="text-white text-2xl font-sans-bold mb-2">
                  {getMessage()}
                  {userName ? `, ${userName}` : ""}!
                </Text>
                <Text className="text-gray-300 text-center mb-2 font-sans">
                  You slept for
                </Text>
                <Text className="text-[#8A7CFF] text-3xl font-sans-bold mb-2">
                  {sleepDuration}
                </Text>
                <Text className="text-gray-300 text-center mb-6 font-sans">
                  {getSleepQualityMessage(getCurrentDaySleepHours())}
                </Text>
                <Pressable
                  className="bg-[#8A7CFF] rounded-xl px-8 py-4 w-full"
                  onPress={() => setStopModalVisible(false)}
                >
                  <Text className="text-white text-center font-sans-bold">
                    Close
                  </Text>
                </Pressable>
              </View>
            </BlurView>
          </Modal>

          {/* date nav */}
          <View className="flex-row justify-between items-center mb-6 bg-[#1E1E30] rounded-xl p-3">
            <TouchableOpacity
              onPress={() => navigateDate(-1)}
              className="bg-[#2D2D2D] p-2 rounded-lg"
            >
              <ChevronLeft size={20} color="#8A7CFF" />
            </TouchableOpacity>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <Text className="text-white text-lg font-sans-medium">
                {formatDate(selectedDate)}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => navigateDate(1)}
              className="bg-[#2D2D2D] p-2 rounded-lg"
            >
              <ChevronRight size={20} color="#8A7CFF" />
            </TouchableOpacity>
          </View>

          {/* Main Tracking Card */}
          <View className="rounded-2xl bg-[#1E1E30] shadow-lg p-6 mb-6">
            {isUserLoading ? (
              <Skeleton className="h-7 w-48 mb-2" />
            ) : (
              <Text className="text-white text-xl font-sans-bold">
                {getMessage()}
                {userName ? `, ${userName}` : ""}!
              </Text>
            )}
            <View className="flex-row justify-between items-center mb-8">
              <View className={`flex-1 ${!isTracking && "mt-10"}`}>
                {isSleepDataLoading ? (
                  <View>
                    <Skeleton className="h-10 w-36 mb-2" />
                    <Skeleton className="h-5 w-48" />
                  </View>
                ) : sleepDuration === "00:00:00" && !isTracking ? (
                  <View className="items-center">
                    <Text className="text-gray-400 text-xl font-sans-bold mb-4">
                      You haven't tracked your sleep on{" "}
                      {formatDate(selectedDate)}
                    </Text>
                    <Image
                      source={require("../../assets/images/sleep1.png")}
                      style={{ width: 250, height: 150 }}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <>
                    <Text className="text-white font-sans-bold text-3xl -mt-4">
                      {isTracking
                        ? formatDuration(elapsedTime, true)
                        : sleepDuration}
                    </Text>
                    <Text className="text-gray-300 font-sans">
                      {isToday() ? "Today's sleep duration" : "Sleep duration"}
                    </Text>
                  </>
                )}

                {isLoading ? (
                  <Skeleton className="h-5 w-60 mt-2" />
                ) : (
                  sleepDuration !== "00:00:00" &&
                  !isTracking &&
                  (() => {
                    const currentDate = selectedDate;
                    const previousDate = new Date(currentDate);
                    previousDate.setDate(currentDate.getDate() - 1);
                    const currentHours = getCurrentDaySleepHours();

                    if (
                      previousDateData &&
                      previousDateData.duration !== "00:00:00"
                    ) {
                      // Convert previous duration to hours
                      let previousHoursValue = 0;
                      const parts = previousDateData.duration.split(" ");
                      parts.forEach((part) => {
                        if (part.includes("h")) {
                          previousHoursValue += parseInt(part);
                        } else if (part.includes("m")) {
                          previousHoursValue += parseInt(part) / 60;
                        } else if (part.includes("s")) {
                          previousHoursValue += parseInt(part) / 3600;
                        }
                      });

                      return (
                        <View className="flex-row items-center gap-2">
                          <View>
                            {currentHours > previousHoursValue ? (
                              <TrendingUp size={16} color="#8A7CFF" />
                            ) : currentHours < previousHoursValue ? (
                              <TrendingDown size={16} color="#8A7CFF" />
                            ) : (
                              <Minus size={16} color="#8A7CFF" />
                            )}
                          </View>
                          <Text className="font-sans w-60 text-gray-400 text-xs">
                            {currentHours > previousHoursValue
                              ? `You slept ${(
                                  currentHours - previousHoursValue
                                ).toFixed(1)}h more than ${
                                  isToday()
                                    ? "yesterday"
                                    : previousDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })
                                }`
                              : currentHours < previousHoursValue
                              ? `You slept ${(
                                  previousHoursValue - currentHours
                                ).toFixed(1)}h less than ${
                                  isToday()
                                    ? "yesterday"
                                    : previousDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })
                                }`
                              : `You slept the same amount as ${
                                  isToday()
                                    ? "yesterday"
                                    : previousDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })
                                }`}
                          </Text>
                        </View>
                      );
                    }
                    return null;
                  })()
                )}
              </View>

              {/* Progress Circle - Sleep Quality */}
              {isSleepDataLoading ? (
                <Skeleton className="h-32 w-32 rounded-full" />
              ) : (
                (sleepDuration !== "00:00:00" || isTracking) && (
                  <View className="items-center justify-center h-32 w-32">
                    <Svg
                      height={size}
                      width={size}
                      viewBox={`0 0 ${size} ${size}`}
                    >
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#2D2D2D"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      {/* Progress Circle */}
                      <Circle
                        ref={circleRef}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#8A7CFF"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                      />
                    </Svg>
                    <View className="absolute items-center justify-center">
                      <Text className="text-[#8A7CFF] text-3xl font-sans-bold">
                        {qualityPercentage}%
                      </Text>
                      <Text className="text-gray-300 text-xs font-sans">
                        QUALITY
                      </Text>
                    </View>
                  </View>
                )
              )}
            </View>

            {/* tracking buttons & timeline */}
            {isSleepDataLoading ? (
              <View className="flex-row justify-center items-center gap-6">
                <Skeleton className="h-24 w-40 rounded-xl" />
                <Skeleton className="h-24 w-40 rounded-xl" />
              </View>
            ) : isToday() ? (
              isTracking ? (
                <View className="flex-row -mt-14 space-x-4">
                  <TouchableOpacity
                    onPress={handleStopTracking}
                    className="flex-row items-center bg-red-600 rounded-xl px-6 py-3"
                  >
                    <StopCircle size={24} color="white" />
                    <Text className="text-white font-sans-bold text-lg ml-2">
                      Stop Tracking
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="-mt-2">
                  {sleepDuration !== "00:00:00" && (
                    <View className="flex-row justify-center items-center gap-6 mb-6">
                      {/* Bedtime */}
                      <View className="items-center bg-[#2D2D2D]/50 rounded-xl p-4 w-40">
                        <View className="bg-[#2D2D2D] p-3 rounded-full mb-2">
                          <Moon size={24} color="#8A7CFF" />
                        </View>
                        <Text className="text-gray-400 text-xs text-center">
                          Bedtime
                        </Text>
                        <Text className="text-white text-base font-medium text-center">
                          {startTime ? formatTime(startTime) : "--:--"}
                        </Text>
                      </View>

                      {/* Wake Up */}
                      <View className="items-center bg-[#2D2D2D]/50 rounded-xl p-4 w-40">
                        <View className="bg-[#2D2D2D] p-3 rounded-full mb-2">
                          <Sun size={24} color="#8A7CFF" />
                        </View>
                        <Text className="text-gray-400 text-xs text-center">
                          Wake Up
                        </Text>
                        <Text className="text-white text-base font-medium text-center">
                          {endTime ? formatTime(endTime) : "--:--"}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View className="flex-row justify-center items-center w-full">
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      className="flex-row items-center justify-center bg-[#8A7CFF] rounded-xl px-6 py-3 w-[100%]"
                    >
                      <Play size={24} color="white" />
                      <Text className="text-white font-sans-bold text-lg ml-2">
                        Start Tracking
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            ) : (
              sleepDuration !== "00:00:00" &&
              startTime &&
              endTime && (
                <View className="flex-row justify-center items-center gap-6">
                  {/* Bedtime */}
                  <View className="items-center bg-[#2D2D2D]/50 rounded-xl p-4 w-40">
                    <View className="bg-[#2D2D2D] p-3 rounded-full mb-2">
                      <Moon size={24} color="#8A7CFF" />
                    </View>
                    <Text className="text-gray-400 text-xs text-center">
                      Bedtime
                    </Text>
                    <Text className="text-white text-base font-medium text-center">
                      {formatTime(startTime)}
                    </Text>
                  </View>

                  {/* Wake Up */}
                  <View className="items-center bg-[#2D2D2D]/50 rounded-xl p-4 w-40">
                    <View className="bg-[#2D2D2D] p-3 rounded-full mb-2">
                      <Sun size={24} color="#8A7CFF" />
                    </View>
                    <Text className="text-gray-400 text-xs text-center">
                      Wake Up
                    </Text>
                    <Text className="text-white text-base font-medium text-center">
                      {formatTime(endTime)}
                    </Text>
                  </View>
                </View>
              )
            )}
          </View>

          {/* Weekly sleep chart */}
          <View className="bg-[#1E1E30] rounded-xl p-6 mb-8 shadow-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-sans-bold text-lg">
                Weekly Sleep
              </Text>
              {isProgressLoading ? (
                <Skeleton className="h-6 w-32 rounded-lg" />
              ) : (
                <View className="bg-[#2D2D2D] px-3 py-1 rounded-lg">
                  <Text className="text-[#8A7CFF] font-sans-medium">
                    {new Date(
                      new Date().getTime() - 6 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-PH", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date().toLocaleDateString("en-PH", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              )}
            </View>

            {isProgressLoading ? (
              <View className="flex-row justify-between items-end h-42 mb-3">
                {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                  <View key={index} className="items-center">
                    <Skeleton className="h-4 w-8 mb-1" />
                    <Skeleton
                      className={cn(
                        "w-8 rounded-t-md",
                        `h-${Math.floor(Math.random() * 20) + 10}`
                      )}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-row justify-between items-end h-42 mb-3">
                {sleepProgress.hours.map((hours, index) => (
                  <View key={index} className="items-center">
                    <View className="items-center">
                      <Text className="text-gray-400 text-xs mb-1">
                        {hours < 0.01 ? "0h" : `${hours.toFixed(1)}h`}
                      </Text>
                      <View
                        style={{
                          height: Math.max(4, (hours / 10) * 100),
                          opacity: index === new Date().getDay() - 1 ? 1 : 0.7,
                        }}
                        className={`w-8 rounded-t-md ${
                          index === new Date().getDay() - 1
                            ? "bg-[#8A7CFF]"
                            : "bg-[#8A7CFF]/70"
                        }`}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View className="flex-row justify-between border-t border-[#2D2D2D] pt-3">
              {isProgressLoading
                ? [0, 1, 2, 3, 4, 5, 6].map((index) => (
                    <Skeleton key={index} className="h-4 w-8" />
                  ))
                : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                      <Text
                        key={index}
                        className={`w-8 text-center ${
                          index === new Date().getDay() - 1
                            ? "text-[#8A7CFF] font-sans-medium"
                            : "text-gray-400 font-sans"
                        }`}
                      >
                        {day}
                      </Text>
                    )
                  )}
            </View>

            <View className="flex-row justify-between items-center mt-4 bg-[#2D2D2D]/50 p-3 rounded-lg">
              {isProgressLoading ? (
                <>
                  <View>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-7 w-20" />
                  </View>
                  <View className="flex-row gap-4">
                    <View className="items-end">
                      <Skeleton className="h-5 w-16 mb-2" />
                      <Skeleton className="h-7 w-14 mb-1" />
                      <Skeleton className="h-3 w-8" />
                    </View>
                    <View className="items-end">
                      <Skeleton className="h-5 w-16 mb-2" />
                      <Skeleton className="h-7 w-14 mb-1" />
                      <Skeleton className="h-3 w-8" />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View>
                    <Text className="text-gray-300 font-sans-medium">
                      Weekly Average
                    </Text>
                    <Text className="text-white text-xl font-sans-bold">
                      {sleepProgress.average.toFixed(1)}h
                    </Text>
                  </View>
                  <View className="flex-row gap-4">
                    <View className="items-end">
                      <View className="flex-row items-center gap-1">
                        <TrendingUp size={16} color="#22c55e" />
                        <Text className="text-gray-300 font-sans-medium">
                          Best
                        </Text>
                      </View>
                      <Text className="text-white text-xl font-sans-bold">
                        {Math.max(...sleepProgress.hours).toFixed(1)}h
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        {
                          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                            sleepProgress.hours.indexOf(
                              Math.max(...sleepProgress.hours)
                            )
                          ]
                        }
                      </Text>
                    </View>
                    <View className="items-end">
                      <View className="flex-row items-center gap-1">
                        <TrendingDown size={16} color="#ef4444" />
                        <Text className="text-gray-300 font-sans-medium">
                          Worst
                        </Text>
                      </View>
                      <Text className="text-white text-xl font-sans-bold">
                        {Math.min(...sleepProgress.hours).toFixed(1)}h
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        {
                          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                            sleepProgress.hours.indexOf(
                              Math.min(...sleepProgress.hours)
                            )
                          ]
                        }
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
