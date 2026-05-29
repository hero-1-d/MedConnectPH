import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const CalendarPicker = ({ selectedDate, onSelect }) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
      <Calendar
        value={selectedDate}
        onChange={onSelect}
        minDate={new Date()}
        className="!w-full !border-0 !bg-transparent p-3"
      />
    </div>
  )
}

export default CalendarPicker
