import CalendarManager from "./CalendarManager";

export default function Calendar() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="text-title-md">Your Calendar</div>
      <CalendarManager />
    </div>
  );
}
