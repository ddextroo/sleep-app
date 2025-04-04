import { supabase } from "../utils/supabase";
import { Platform, ToastAndroid } from "react-native";

const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
};

export const startSleepTracking = async (
  start_time: number,
  end_time: number | null,
  duration: number
) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    console.error(authError);
    showToast("Unable to fetch user.");
    return;
  }

  const user_id = authData.user.id;

  // Convert to PH timezone (UTC+8)
  const toPostgresTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const phOffset = 8 * 60;
    const userOffset = date.getTimezoneOffset();
    const offsetDiff = phOffset + userOffset;
    date.setMinutes(date.getMinutes() + offsetDiff);
    return date.toISOString();
  };

  if (!end_time) {
    // Starting new tracking - first deactivate any existing active sessions
    const { error: deactivateError } = await supabase
      .from("sleep_track")
      .update({ is_active: false })
      .eq("user_id", user_id)
      .eq("is_active", true);

    if (deactivateError) {
      console.error(deactivateError);
      showToast("Failed to deactivate existing session.");
      return;
    }

    // insert new active session
    const { error: insertError } = await supabase
      .from("sleep_track")
      .insert([
        {
          user_id: user_id,
          start_time: toPostgresTimestamp(start_time),
          end_time: null,
          duration: duration,
          is_active: true,
        },
      ]);

    if (insertError) {
      console.error(insertError);
      showToast(insertError.message);
    } else {
      showToast("Sleep tracking started!");
    }
  } else {
    // Stopping tracking - update the active session
    const { error: updateError } = await supabase
      .from("sleep_track")
      .update({
        end_time: toPostgresTimestamp(end_time),
        duration: duration,
        is_active: false,
      })
      .eq("user_id", user_id)
      .eq("is_active", true);

    if (updateError) {
      console.error(updateError);
      showToast(updateError.message);
    } else {
      showToast("Sleep tracking completed!");
    }
  }
};

// formats duration from seconds to HH:MM:SS or HHh MMm SSs
export const formatDuration = (seconds: number, isTracking: boolean = false): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (isTracking) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  } else {
    // format
    if (hours === 0) {
      if (minutes === 0) {
        return `${remainingSeconds}s`;
      }
      return `${minutes}m ${remainingSeconds}s`;
    } else if (minutes === 0) {
      if (remainingSeconds === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${remainingSeconds}s`;
    } else {
      if (remainingSeconds === 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
  }
};

export const getSleepProgress = async () => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    console.error("Auth error:", authError);
    return null;
  }

  const user_id = authData.user.id;
  console.log("Fetching data for user:", user_id);

  const today = new Date();
  today.setHours(today.getHours() + 8); // convert to ph

  // Get the start of the 14-day range
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  // Set today to end of day
  const endDate = new Date(today);
  endDate.setHours(23, 59, 59, 999);

  console.log("Fetching data from:", fourteenDaysAgo.toISOString(), "to", endDate.toISOString());

  const { data, error } = await supabase
    .from("sleep_track")
    .select("start_time, end_time, duration")
    .eq("user_id", user_id)
    .gte("end_time", fourteenDaysAgo.toISOString())
    .lte("end_time", endDate.toISOString())
    .order("end_time", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return null;
  }

  console.log("Raw data from Supabase:", data);

  // arrays to store data (this week and last week)
  const thisWeek = Array(7).fill(0);
  const lastWeek = Array(7).fill(0);

  data.forEach(item => {
    const wakeUpDate = new Date(item.end_time);
    wakeUpDate.setHours(wakeUpDate.getHours() + 8); // convert to ph

    // Calculate which day index this sleep record belongs to
    const dayIndex = Math.floor((wakeUpDate.getTime() - fourteenDaysAgo.getTime()) / (24 * 60 * 60 * 1000));

    if (dayIndex >= 0 && dayIndex < 7) {
      lastWeek[dayIndex] += item.duration / 3600; // Convert seconds to hours
    } else if (dayIndex >= 7 && dayIndex < 14) {
      thisWeek[dayIndex - 7] += item.duration / 3600;
    }
  });

  // use last weeks data if no data for this day
  for (let i = 0; i < 7; i++) {
    if (thisWeek[i] === 0) {
      thisWeek[i] = lastWeek[i]; 
    }
  }

  // reorder based on the current day
  const todayIndex = new Date(today).getDay();
  const reorderedData = new Array(7);
  for (let i = 0; i < 7; i++) {
    reorderedData[i] = thisWeek[(todayIndex - 6 + i + 7) % 7];
  }

  const result = {
    hours: reorderedData,
    average: reorderedData.reduce((a, b) => a + b, 0) / reorderedData.length,
  };

  console.log("Final processed data:", result);
  return result;
};

export const getSleepDataForDate = async (date: Date) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    console.error("Auth error:", authError);
    return null;
  }

  const user_id = authData.user.id;

  // set the start and end of the selected date in ph
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  console.log("Searching for sleep data between:", startOfDay.toISOString(), "and", endOfDay.toISOString());

  const { data, error } = await supabase
    .from("sleep_track")
    .select("start_time, end_time, duration")
    .eq("user_id", user_id)
    .gte("end_time", startOfDay.toISOString())
    .lte("end_time", endOfDay.toISOString())
    .order("end_time", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return null;
  }

  console.log("Found sleep data:", data);

  if (!data || data.length === 0) {
    return {
      duration: "00:00:00",
      startTime: null,
      endTime: null
    };
  }

  // get the total duration for the day
  const totalDuration = data.reduce((acc, item) => acc + item.duration, 0);
  
  // convert start and end times to ph
  const convertToPHTime = (timestamp: string) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 8); 
    return date.getTime();
  };
  
  return {
    duration: formatDuration(totalDuration),
    startTime: convertToPHTime(data[0].start_time),
    endTime: convertToPHTime(data[data.length - 1].end_time)
  };
};  
