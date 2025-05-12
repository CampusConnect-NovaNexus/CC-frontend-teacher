import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LineChartProps {
  data: number[];
  labels: string[];
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  title?: string;
}

const SimpleLineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  width = 300,
  height = 220,
  color = '#000000',
  backgroundColor = '#ffffff',
  title
}) => {
  if (data.length === 0) return null;

  // Calculate average for a simple display
  const average = data.reduce((sum, value) => sum + value, 0) / data.length;
  
  return (
    <View style={[
      styles.container, 
      { 
        width, 
        height, 
        backgroundColor 
      }
    ]}>
      {title && <Text style={[styles.title, { color: '#000000' }]}>{title}</Text>}
      
      <View style={styles.dataContainer}>
        {labels.map((label, index) => (
          <View key={index} style={styles.dataColumn}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: `${data[index]}%`, 
                  backgroundColor: color,
                  maxHeight: '100%'
                }
              ]} 
            />
            <Text style={[styles.label, { color: '#000000' }]}>{label}</Text>
            <Text style={[styles.value, { color: '#000000' }]}>{data[index]}%</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.averageContainer}>
        <Text style={[styles.averageText, { color: '#000000' }]}>
          Average: {average.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
  },
  dataColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '22%',
  },
  bar: {
    width: '80%',
    minHeight: 20,
    borderRadius: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  averageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  averageText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default SimpleLineChart;