import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import "./DateRangePicker.css"

const DateRangePicker = ({ startDate, setStartDate, endDate, setEndDate }) => {
    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <button className="custom-input" onClick={onClick} ref={ref}>
            {/* 시작 날짜와 끝 날짜가 동일한 경우 단일 날짜만 표시 */}
            {startDate && endDate && startDate.getTime() === endDate.getTime()
                ? startDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
                : value || '날짜를 선택하세요'}
        </button>
    ));

    return (
        <DatePicker
            selected={startDate}
            onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            locale={ko}
            dateFormat="yyyy년 MM월 dd일"
            customInput={<CustomInput />}
            placeholderText="날짜를 선택하세요"
            minDate={new Date()} // 오늘 이후 날짜만 선택 가능
        />
    );
};

export default DateRangePicker;
