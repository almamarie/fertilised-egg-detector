import React from "react";
import { NavLink, Outlet } from "react-router";
import { BellIcon } from "~/icons/bell";
import { IconCozy } from "~/icons/cozy";
import { DropdownIcon } from "~/icons/icon-dropdown";
import { IconLogout } from "~/icons/logout";
import { IconManual } from "~/icons/manual";
import { PersonIcon } from "~/icons/person";

const layout = () => {
  return (
    <div className="w-220 mx-auto pt-5 pb-10 grid grid-cols-[180px_1fr] gap-12 align-bottom h-dvh">
      <div className="grid grid-rows-[30px_1fr] gap-5">
        <img src="logo.jpg" className="w-8 h-8 hover:cursor-pointer" />
        <div className="shadow-[0_2px_4px_rgba(0,0,0,0.25)] p-2 pt-5 rounded-lg flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/overview"
              className={({ isActive }) =>
                [
                  "flex gap-2 align-middle items-center font-medium cursor-pointer rounded-s-md pl-1 py-1 hover:bg-green-200",
                  isActive
                    ? "bg-green-500 hover:bg-green-500 text-white hover:text-white"
                    : "",
                ].join(" ")
              }
              end
            >
              <IconCozy className="w-5 h-5" />
              Overview
            </NavLink>

            <NavLink
              to="/manual-check"
              className={({ isActive }) =>
                [
                  "flex gap-2 align-middle items-center font-medium cursor-pointer rounded-s-md pl-1 py-1 hover:bg-green-200",
                  isActive
                    ? "bg-green-500 hover:bg-green-500 text-white hover:text-white"
                    : "",
                ].join(" ")
              }
              end
            >
              <IconManual className="w-5 h-5" />
              Manual Check
            </NavLink>
          </div>

          <div className="flex align-middle items-center hover:cursor-pointer">
            <IconLogout className="w-5 h-5 stroke-green-500" />
            <p className="text-sm">Logout</p>
          </div>
        </div>
      </div>

      <div>
        <div className="border-[.5px] border-black/50 p-1 pr-2 text-xs rounded-lg flex justify-end items-center gap-2 mb-8">
          <BellIcon className="w-4 h-4" />
          <PersonIcon className="w-4 h-4" />
          <p>Ariella Anafo</p>
          <DropdownIcon className="w-4 h-4" />
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default layout;
