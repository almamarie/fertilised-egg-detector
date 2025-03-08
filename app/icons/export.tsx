import type { SVGProps } from "react";

export function IconExport(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m8 19.425l-2.25 2.25q-.3.3-.7.288t-.7-.313q-.275-.3-.287-.7t.287-.7L6.6 18H5.35q-.425 0-.712-.287T4.35 17t.288-.712T5.35 16H9q.425 0 .713.288T10 17v3.65q0 .425-.288.713T9 21.65t-.712-.287T8 20.65zM5 14q-.425 0-.712-.288T4 13V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22h-5q-.425 0-.712-.288T12 21t.288-.712T13 20h5V9h-4q-.425 0-.712-.288T13 8V4H6v9q0 .425-.288.713T5 14"
      ></path>
    </svg>
  );
}
