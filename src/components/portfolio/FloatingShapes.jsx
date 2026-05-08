export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Shape 1 - top left */}
      <div className="absolute top-[15%] left-[8%] w-20 h-20 md:w-32 md:h-32 bg-white/[0.04] rounded-2xl rotate-12 animate-float1" />
      {/* Shape 2 - center left */}
      <div className="absolute top-[40%] left-[20%] w-24 h-24 md:w-40 md:h-40 bg-white/[0.03] rounded-3xl rotate-45 animate-float2" />
      {/* Shape 3 - bottom center */}
      <div className="absolute top-[55%] left-[35%] w-28 h-28 md:w-44 md:h-44 bg-white/[0.04] rounded-2xl rotate-[30deg] animate-float3" />
      {/* Shape 4 - top right */}
      <div className="absolute top-[10%] right-[15%] w-16 h-16 md:w-24 md:h-24 bg-white/[0.03] rounded-full animate-float2" style={{ animationDelay: '-5s' }} />
      {/* Shape 5 - center right */}
      <div className="absolute top-[30%] right-[5%] w-32 h-32 md:w-48 md:h-48 bg-white/[0.04] rounded-3xl rotate-[60deg] animate-float1" style={{ animationDelay: '-10s' }} />
      {/* Shape 6 - bottom right */}
      <div className="absolute top-[60%] right-[10%] w-20 h-20 md:w-36 md:h-36 bg-white/[0.03] rounded-2xl rotate-[-20deg] animate-float3" style={{ animationDelay: '-8s' }} />
      {/* Small dot */}
      <div className="absolute top-[8%] left-[10%] w-3 h-3 bg-white/10 rounded-full animate-float1" style={{ animationDelay: '-3s' }} />
    </div>
  );
}