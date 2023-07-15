function displayPercentage(percentage) {
  if (!percentage) {
    throw new Error('Too few arguments specified in displayPercentage');
  }

  if (typeof percentage !== 'number') {
    throw new Error('Invalid arguments specified in displayPercentage');
  }
}
