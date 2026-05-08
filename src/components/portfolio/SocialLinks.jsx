import { Facebook, Linkedin, Github } from "lucide-react";

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/aldrineyana98", label: "Facebook" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/aldrin-eyana-1335ba26b/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/YAPZORR", label: "Github" },
];

export default function SocialLinks({ size = "md" }) {
  const sizeClasses = size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const iconSize = size === "lg" ? 20 : 18;

  return (
    <div className="flex items-center gap-3">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${sizeClasses} rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-300 group relative`}
        >
          <s.icon size={iconSize} />
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {s.label}
          </span>
        </a>
      ))}
    </div>
  );
}