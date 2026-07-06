export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatMatchTime = (seconds: number, addedTime: number = 0): string => {
  const mins = Math.floor(seconds / 60);
  const displayMins = mins > 90 ? mins : mins;
  const addedText = addedTime > 0 && mins >= 45 ? `+${addedTime}` : '';
  return `${displayMins}'${addedText}`;
};

export const getPeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    first_half: '1er Tiempo',
    second_half: '2do Tiempo',
    extra_time_first: 'Prórroga 1',
    extra_time_second: 'Prórroga 2',
    penalties: 'Penales',
  };
  return labels[period] || period;
};

export const calculateAddedTime = (events: any[]): number => {
  let addedTime = 0;
  events.forEach(event => {
    if (event.type === 'substitution') addedTime += 0.5;
    if (event.type === 'goal') addedTime += 1;
    if (event.type === 'injury') addedTime += 2;
    if (event.type === 'var_review') addedTime += 1.5;
  });
  return Math.ceil(addedTime);
};