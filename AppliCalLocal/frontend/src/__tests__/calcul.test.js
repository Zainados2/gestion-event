import '@testing-library/jest-dom';
import { calculateHours } from '../utils/calculateHours';

describe('fonction calcul des heures', () => {
  it('/', () => {
    const mockedEvents = [
      {
        id: 80,start: '2024-08-08T00:00:00.000Z',end: '2024-08-08T11:00:00.000Z',
      },
      {
        id: 81,start: '2024-08-08T00:00:00.000Z',end: '2024-08-09T00:00:00.000Z',
      },
      {
        id: 82,start: '2024-08-31T07:30:00.000Z',end: '2024-08-31T11:00:00.000Z',
      },
    ];
    
    const selectedMonth = 8;
    const selectedYear = 2024;
    const result = calculateHours(mockedEvents, selectedMonth, selectedYear); 
    
    expect(result.heuresEffectuees).toBe(16.00)
    expect(result.heuresAVenir).toBe(3.50)
    expect(result.totalHeures).toBe(19.50)
  });
});
