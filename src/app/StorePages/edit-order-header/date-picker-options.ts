export const datePickerObj: any = {
    inputDate: new Date('2018-08-10'), // default new Date()
    fromDate: new Date('2016-12-08'), // default null
    toDate: new Date('2021-12-28'), // default null
    showTodayButton: true, // default true
    closeOnSelect: true, // default false
    disableWeekDays: [], // default []
    mondayFirst: true, // default false
  //  setLabel: 'set',  // default 'Set'
   // todayLabel: 'today', // default 'Today'
   // closeLabel: 'close', // default 'Close'
    disabledDates: [], // default []
    titleLabel: 'Select a Date', // default null
    monthsList: ["Jan-01", "Feb-02", "March-03", "April-04", "May-05", "June-06",
                 "July-07", "Aug-08", "Sept-09", "Oct-10", "Nov-11", "Dec-12"],
    weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
    clearButton : false , // default true
    momentLocale: 'en-US', // Default 'en-US'
    yearInAscending: true, // Default false
    btnCloseSetInReverse: true, // Default false
    btnProperties: {
      expand: 'block', // Default 'block'
      fill: '', // Default 'solid'
      size: '', // Default 'default'
      disabled: '', // Default false
      strong: '', // Default false
      color: '' // Default ''
    },
    arrowNextPrev: {
      nextArrowSrc: 'assets/images/arrow_right.svg',
      prevArrowSrc: 'assets/images/arrow_left.svg'
    }, // This object supports only SVG files.
    highlightedDates: [
     { date: new Date('2019-09-10'), color: '#ee88bf', fontColor: '#fff' },
     { date: new Date('2019-09-12'), color: '#50f2b1', fontColor: '#fff' }
    ] // Default []
  };
