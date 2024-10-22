// ./components/CalendarView.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseconfig'; // Firestore config

interface CalendarViewProps {
  userId: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ userId }) => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked: boolean } }>({});

  useEffect(() => {
    const fetchMarkedDates = async () => {
      try {
        const q = query(collection(db, 'expenses'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const dates: { [key: string]: { marked: boolean } } = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.date; // Assuming 'date' is a string like 'YYYY-MM-DD'
          dates[date] = { marked: true };
        });
        setMarkedDates(dates);
      } catch (error) {
        console.error("Error fetching calendar data: ", error);
      }
    };

    fetchMarkedDates();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day: DateData) => {
          console.log('Selected day', day);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});

export default CalendarView;
