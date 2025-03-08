import { useState } from "react";
import { IconExport } from "~/icons/export";
import { IconMarker } from "~/icons/marker";
import { IconTemp } from "~/icons/temp";

const Overview = () => {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);

  const scheduleCapture = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/schedule-auto-capture"
      );
      const resData = await response.json();
      setData(resData.message);
      setError(null);
    } catch (error) {
      setError("failed to schedule auto capture");
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  const printPage = () => {
    print();
  };
  return (
    <div className="relative">
      <button
        onClick={printPage}
        className="flex gap-2 align-middle items-center font-medium cursor-pointer rounded-s-md pl-1 py-1 hover:bg-green-400 absolute right-0"
      >
        <IconExport />
        Export Report
      </button>
      <h1 className="text-xl pb-6">Overview</h1>
      <div className="grid grid-cols-2 gap-14">
        <div className="px-3 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
          <div className="flex gap-3 items-center">
            <div className="bg-green-500 p-2 rounded-sm">
              <IconTemp className="w-4 h-4" />
            </div>
            <p className="text-xs">Temperature</p>
          </div>
          <div className="mt-5">
            <div className="bg-[linear-gradient(to_right,white,red)] h-2 w-full rounded-[5px]">
              <IconMarker />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs">0&deg;C</p>
              <p className="text-xs">50&deg;C</p>
              <p className="text-xs">100&deg;C</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
          <div className="flex gap-3 items-center">
            <div className="bg-green-500 p-2 rounded-sm">
              <IconTemp className="w-4 h-4" />
            </div>
            <p className="text-xs">Humidity</p>
          </div>
          <div className="mt-5">
            <div className="bg-[linear-gradient(to_right,white,green)] h-2 w-full rounded-[5px]">
              <IconMarker />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs">0%C</p>
              <p className="text-xs">50%</p>
              <p className="text-xs">100%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 mt-10 justify-between gap-4">
        <div className="relative flex gap-2 text-sm px-6 pt-7 pb-3 shadow-[0_2px_4px_rgba(0,0,0,0.25)] rounded-xs">
          <div className="bg-green-500 w-8 h-8 rounded-full absolute top-0 left-4 transform translate-y-[-50%] overflow-hidden z-2">
            <img src="/egg.png" className="w-8 h-8" />
          </div>
          <div className="bg-green-200 text-[8px] absolute top-0 left-11 py-[5px] px-2 z-1 transform translate-y-[-50%]">
            Fertilised eggs
          </div>
          <p>Fertilised Eggs:</p>
          <p className="font-extrabold">40</p>
        </div>

        <div className="relative flex gap-2 text-sm px-6 pt-7 pb-3 shadow-[0_2px_4px_rgba(0,0,0,0.25)] rounded-xs">
          <div className="bg-green-500 w-8 h-8 rounded-full absolute top-0 left-4 transform translate-y-[-50%] overflow-hidden z-2">
            <img src="/egg.png" className="w-8 h-8" />
          </div>
          <div className="bg-green-200 text-[8px] absolute top-0 left-11 py-[5px] px-2 z-1 transform translate-y-[-50%]">
            Unfertilised eggs
          </div>
          <p>Unfertilised Eggs:</p>
          <p className="font-extrabold">15</p>
        </div>

        <div className="relative flex gap-2 text-sm px-6 pt-7 pb-3 shadow-[0_2px_4px_rgba(0,0,0,0.25)] rounded-xs">
          <div className="bg-green-500 w-8 h-8 rounded-full absolute top-0 left-4 transform translate-y-[-50%] overflow-hidden z-2">
            <img src="/chick.png" className="w-8 h-8" />
          </div>
          <div className="bg-green-200 text-[8px] absolute top-0 left-11 py-[5px] px-2 z-1 transform translate-y-[-50%]">
            Chickens Hatched
          </div>
          <p>Hatched Eggs:</p>
          <p className="font-extrabold">40</p>
        </div>
      </div>
      <h2 className="pt-6">Fertilization Automation</h2>

      <button
        disabled={loading ?? false}
        onClick={scheduleCapture}
        className="flex gap-2 align-middle items-center font-medium cursor-pointer rounded-s-md pl-1 py-1 mt-4 ml-4 hover:bg-green-400"
      >
        Schedule Capture
      </button>
      <div className="mt-4 ml-4">
        {!loading && <p className="text-sm">{error ?? data}</p>}
        {loading && (
          <div className="w-5 h-5 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
    </div>
  );
};

export default Overview;
