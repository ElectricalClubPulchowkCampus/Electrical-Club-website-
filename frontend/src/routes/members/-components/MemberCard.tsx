import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import type { Member } from '../../../types/member';
import { FiPhone, FiMail, FiHash } from 'react-icons/fi';

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const MemberCard = ({ member }: { member: Member }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = member.profile_pic?.formats?.medium?.url;
  const showFallback = !imageUrl || imageError;

  return (
    // Width is owned entirely by the parent grid now (no max-w-sm cap),
    // and flex flex-col h-full lets quote/no-quote cards match row height.
    <div className="group relative w-full h-full flex flex-col bg-card rounded-2xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(124,58,237,0.12)] hover:-translate-y-1 hover:border-primary/50">
      
      {/* Primary Clickable Area (The Card Overlay) */}
      <Link
        to="/members/$slug"
        params={{ slug: member.slug }}
        className="absolute inset-0 z-10"
        aria-label={`View profile for ${member.name}`}
      />

      {/* Card Visuals */}
      <div className="h-[3px] w-full bg-gradient-to-r from-accent via-primary to-primary/30" />

      <div className="flex items-center gap-2 px-6 pt-5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <span className="text-[10px] font-mono tracking-[0.2em] text-accent uppercase">
          Member Access
        </span>
      </div>

      <div className="flex items-start gap-4 px-6 pt-4">
        <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
          <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-primary" />
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-primary" />
          <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-primary" />
          <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-primary" />
          {showFallback ? (
            <div className="w-16 h-16 flex items-center justify-center bg-primary/10 text-primary font-bold text-lg font-mono select-none">
              {getInitials(member.name)}
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={member.name}
              onError={() => setImageError(true)}
              className="w-16 h-16 object-cover bg-muted"
            />
          )}
        </div>

        <div className="pt-1 min-w-0">
          <h2 className="text-lg font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
            {member.name}
          </h2>
          <span className="inline-block mt-1 text-[11px] font-mono font-medium text-primary uppercase tracking-wider">
            // {member.role}
          </span>
        </div>
      </div>

      <div className="mx-6 mt-5 border-t border-dashed border-border" />

      {/* Contact rows: Relative Z-20 ensures these stay clickable over the Link overlay */}
      <div className="relative z-20 px-6 py-4 flex flex-col gap-2.5">
        {member.rollNumber && (
          <div className="flex items-center gap-3 text-sm text-foreground min-w-0">
            <FiHash className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-mono text-[11px] tracking-wider text-muted-foreground w-9 shrink-0">ROLL:</span>
            <span className="font-mono text-foreground truncate min-w-0 flex-1">{member.rollNumber}</span>
          </div>
        )}
        
        <a href={`tel:${member.phone_number}`} className="flex items-center gap-3 text-sm group/tel -mx-2 px-2 py-1 rounded-md hover:bg-primary/5 transition-colors min-w-0">
          <FiPhone className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground w-9 shrink-0">TEL</span>
          <span className="font-mono text-foreground group-hover/tel:text-primary truncate min-w-0 flex-1">{member.phone_number}</span>
        </a>

        <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-sm group/mail -mx-2 px-2 py-1 rounded-md hover:bg-primary/5 transition-colors min-w-0">
          <FiMail className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground w-9 shrink-0">MAIL</span>
          <span className="font-mono text-foreground truncate group-hover/mail:text-primary min-w-0 flex-1">{member.email}</span>
        </a>
      </div>

      {member.quote && (
        <div className="relative z-20 mx-6 mb-6 mt-1 px-4 py-3 rounded-lg bg-muted border border-border">
          <p className="text-[13px] text-muted-foreground leading-relaxed italic break-words">
            "{member.quote}"
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberCard;