const getRoundedDuration = (startTimestamp: number, stopTimestamp: number): number => {
  const duration: number = (stopTimestamp - startTimestamp) / 1000
  const roundedDurationString: string = duration.toFixed(2)
  const roundedDuration: number = Number.parseFloat(roundedDurationString)

  return roundedDuration
}

export default {
  getRoundedDuration,
}
