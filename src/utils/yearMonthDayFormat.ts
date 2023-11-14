export default function yearMonthDayFormat(seconds: number) {
  const formatDate = new Date(seconds * 1000);

  let month: number | string = formatDate.getMonth() + 1;
  let day: number | string = formatDate.getDate();

  month = month >= 10 ? month : `0${month}`;
  day = day >= 10 ? day : `0${day}`;

  return `${formatDate.getFullYear()}. ${month}. ${day}`;
}
