import React from 'react'
import { Text } from 'react-native-paper'

const CycleTime = () => {
  return (
    <Text style={{ fontSize: 20 }}>{new Date().toLocaleDateString()}</Text>
  )
}

export default CycleTime