// ./components/Chart.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseconfig'; // Firestore config

interface ChartProps {
  userId: string;
}

const Chart: React.FC<ChartProps> = ({ userId }) => {
  const [expenseData, setExpenseData] = useState<number[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const q = query(collection(db, 'expenses'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const expenses: number[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          expenses.push(data.amount); // Assuming 'amount' is the field for expense
        });
        setExpenseData(expenses);
      } catch (error) {
        console.error("Error fetching expenses: ", error);
      }
    };
    
    fetchExpenses();
  }, [userId]);

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Example labels
          datasets: [{ data: expenseData }],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#f5f5f5",
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
});

export default Chart;
