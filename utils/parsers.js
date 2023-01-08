export const calculateTestGrade = (selectedAns = 0, correctAns, time) => {
  const maxTime = 35;
  const value = 100;
  let result;
  if (selectedAns === correctAns) {
    result = Math.ceil((result = (value * (maxTime - time)) / maxTime));
    return 100 + result;
  }
  return 0;
};
