// A single, decorative pass that travels with the selected vehicle.
export function EnvironmentTransition({ type }) {
  return (
    <svg className={`environment-transition environment-${type}`} viewBox="0 0 240 160" fill="none" aria-hidden="true" focusable="false">
      {type === "uav" && (
        <g className="air-streams">
          <path d="M12 66C50 37 73 90 123 60S194 32 228 50" />
          <path d="M0 89C42 63 73 106 125 80S193 55 240 72" />
          <path d="M25 109C70 82 86 123 139 100S199 81 221 91" />
        </g>
      )}
      {type === "rov" && (
        <>
          <g className="underwater-light">
            <path d="M21 93Q69 55 116 92T221 78" />
            <path d="M9 109Q66 80 121 107T232 99" />
          </g>
          <g className="water-bubbles">
            {[ [51,109,3], [78,128,2], [170,116,3.5], [190,92,2], [104,120,1.5], [147,134,2.5] ].map(([cx,cy,r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} style={{ "--particle-delay": `${i * 65}ms`, "--drift": `${i % 2 ? 8 : -8}px` }} />
            ))}
          </g>
        </>
      )}
      {type === "usv" && (
        <g className="surface-ripples">
          {[0, 1, 2].map(i => <ellipse key={i} cx="120" cy="113" rx="47" ry="10" style={{ "--particle-delay": `${i * 170}ms` }} />)}
        </g>
      )}
      {type === "rocket" && (
        <g className="ground-dust">
          {[ [67,119,2], [78,125,1.2], [91,121,2.6], [107,127,1.5], [127,122,2], [142,127,1.3], [158,120,2.3], [172,123,1.5], [119,131,1] ].map(([cx,cy,r], i) => (
            <path key={i} d={`M${cx} ${cy}l${r * 2} ${-r * .6}`} style={{ "--particle-delay": `${i * 45}ms`, "--drift": `${(cx - 120) * .85}px`, "--lift": `${-10 - (i % 3) * 8}px` }} />
          ))}
          <path className="dust-ground" d="M50 129Q120 133 189 129" />
        </g>
      )}
    </svg>
  );
}
