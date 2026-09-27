import { Children, cloneElement } from "react";

export function VehicleMark({ type, className = "", illuminated = false }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.35,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    vectorEffect: "non-scaling-stroke",
  };

  const paths = {
    uav: (
      <>
        <path d="M50 35v30M35 50h30M39 44l-13-13M61 44l13-13M39 56 26 69M61 56l13 13" />
        <circle cx="50" cy="50" r="7" />
        <circle cx="22" cy="27" r="9" /><circle cx="78" cy="27" r="9" />
        <circle cx="22" cy="73" r="9" /><circle cx="78" cy="73" r="9" />
        <path d="M47 44h6l3 6-3 6h-6l-3-6zM18 27h8M74 27h8M18 73h8M74 73h8" />
      </>
    ),
    rov: (
      <>
        <path d="M25 36h50v31H25zM31 36V26h38v10M34 45h32v13H34z" />
        <path d="M25 48H15v13h10M75 48h10v13H75M31 67l-8 9M69 67l8 9M42 26v-7h16v7" />
        <circle cx="40" cy="51.5" r="3.5" /><circle cx="50" cy="51.5" r="3.5" /><circle cx="60" cy="51.5" r="3.5" />
      </>
    ),
    usv: (
      <>
        <path d="M16 61h68l-9 14H27zM31 61l5-17h28l7 17M42 44V29h16v15" />
        <path d="M50 29V18M50 21l12 7M40 51h20M20 82c8-4 14 4 22 0s14 4 22 0 13 3 20 0" />
        <circle cx="50" cy="18" r="2.5" />
      </>
    ),
    rocket: (
      <>
        <path d="M43 30Q50 8 57 30M43 30h14v40H43zM43 56 32 72l11-3M57 56l11 16-11-3M46 70l-2 7h12l-2-7" />
        <circle cx="50" cy="41" r="4" />
        <path d="M47 81q-2 5 1 9M53 81q2 5-1 9M50 81v11" />
      </>
    ),
    vision: (
      <>
        <path d="M18 30V18h12M70 18h12v12M82 70v12H70M30 82H18V70" />
        <path d="M36 36h28v28H36zM41 41h7v7h-7zM52 52h7v7h-7zM52 41h7v4" />
        <circle cx="50" cy="50" r="24" />
      </>
    ),
  };

  const drawing = paths[type];
  const strokes = illuminated
    ? Children.toArray(drawing.props.children).filter((child) => child.type)
    : [];

  return (
    <svg className={`vehicle-mark ${className}`} viewBox="0 0 100 100" role="img" aria-label={`${type} çizimi`} {...common}>
      {illuminated ? (
        <>
          <g className="intro-trace">{drawing}</g>
          {["intro-ink", "intro-light"].map((layer) => (
            <g className={layer} key={layer}>
              {strokes.map((stroke, index) => cloneElement(stroke, {
                key: index,
                pathLength: 1,
                vectorEffect: "non-scaling-stroke",
                style: { "--stroke-delay": `${index * 0.045}s` },
              }))}
            </g>
          ))}
        </>
      ) : drawing}
    </svg>
  );
}
