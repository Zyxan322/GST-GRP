export function ProjectIllustration() {
  return (
    <div
      role="img"
      aria-label="Illustrative architectural artwork; not a photograph of this project"
      className="relative w-full h-full overflow-hidden bg-[#101c21]"
    >
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect width="800" height="600" fill="#19282c" />
        <path d="M0 490H800M0 525H800M0 560H800" stroke="#d6b66c" strokeOpacity=".12" />
        <path
          d="M90 490V215L250 162V490M273 490V118L453 165V490M480 490V248L672 194V490"
          fill="#19282c"
          stroke="#d6b66c"
          strokeOpacity=".58"
          strokeWidth="2"
        />
        <path
          d="M90 250L250 205M90 298L250 253M90 346L250 301M90 394L250 349M90 442L250 397M273 168L453 214M273 222L453 268M273 276L453 322M273 330L453 376M273 384L453 430M480 284L672 234M480 334L672 284M480 384L672 334M480 434L672 384"
          stroke="#9eaa9b"
          strokeOpacity=".45"
        />
        <path
          d="M143 490V235M196 490V218M333 490V134M393 490V150M535 490V232M606 490V213"
          stroke="#9eaa9b"
          strokeOpacity=".32"
        />
        <path d="M0 490H800" stroke="#d6b66c" strokeOpacity=".6" strokeWidth="2" />
        <circle cx="640" cy="104" r="52" fill="#d6b66c" fillOpacity=".08" />
        <path
          d="M640 25V183M561 104H719M584 48L696 160M696 48L584 160"
          stroke="#d6b66c"
          strokeOpacity=".16"
        />
      </svg>
      <span className="absolute right-4 top-4 z-10 max-w-[85%] rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[10px] font-medium uppercase leading-4 tracking-[0.14em] text-white/90 backdrop-blur-sm">
        Illustrative only · not project photography
      </span>
    </div>
  );
}
