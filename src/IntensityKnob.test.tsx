import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScheduleIntensityDemo from './ScheduleIntensityDemo'
test('default selection is moderate', () => {
    render(<ScheduleIntensityDemo />)
    expect(screen.getByDisplayValue('4')).toBeInTheDocument()
  })
  
  test('clicking Extreme updates fields', async () => {
    render(<ScheduleIntensityDemo />)
    await userEvent.click(screen.getByRole('radio', { name: 'Extreme!' }))
    expect(screen.getByDisplayValue('7')).toBeInTheDocument()
  })
  
  test('clicking Steady updates fields', async () => {
    render(<ScheduleIntensityDemo />)
    await userEvent.click(screen.getByRole('radio', { name: 'Steady' }))
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
  })