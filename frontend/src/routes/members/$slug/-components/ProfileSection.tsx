  import React, { type JSX } from 'react';
  import type { Member } from '../../../../types/member';
  import { useNavigate } from '@tanstack/react-router';
  import { FaArrowLeft } from "react-icons/fa6";
  import { 
    FaGithub, 
    FaTwitter, 
    FaLinkedin, 
    FaGlobe, 
    FaEnvelope, 
    FaFacebook, 
    FaInstagram, 
    FaYoutube, 
    FaTiktok 
  } from "react-icons/fa6";
  import { FaQuestion } from "react-icons/fa6";
  const platformIcons: Record<string, JSX.Element> = {
    github: <FaGithub className="size-4" />,
    twitter: <FaTwitter className="size-4" />,
    linkedin: <FaLinkedin className="size-4" />,
    website: <FaGlobe className="size-4" />,
    email: <FaEnvelope className="size-4" />,
    facebook: <FaFacebook className="size-4" />,
    instagram: <FaInstagram className="size-4" />,
    youtube: <FaYoutube className="size-4" />,
    tiktok: <FaTiktok className="size-4" />,
  };
  interface ProfilePageProps {
    member: Member;
  }

  const ProfilePage = ({ member }: ProfilePageProps) => {

    return (
        <div>
          {/* Hero Section */}  
          <button 
  type="button" // Always good practice to explicitly state type="button"
  onClick={() => window.history.back()}
  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
>
  <FaArrowLeft className="size-3" />
  Back
</button>
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12 mt-6">
            <img 
              src={member.profile_pic?.formats?.large?.url} 
              alt={member.name}
              className="w-64 h-80 object-cover bg-muted rounded-[--radius-lg] flex-shrink-0"
            />
            <div>
              <h2 className="text-sm text-primary font-bold uppercase tracking-wider">
                {member.team?.name} {member.team?.category} - 
                {(member.role === 'President' || member.role === 'Lead') ? 'Leadership' : 'Member'}
              </h2>
              <h1 className="text-4xl font-extrabold mt-1 text-foreground">{member.name}</h1>
              <p className="text-2xl font-semibold text-foreground/80">{member.role}</p>
              <blockquote className="italic text-lg text-muted-foreground mt-4 border-l-4 border-primary pl-4">
                {member.quote}
              </blockquote>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-card p-6 rounded-[--radius-lg] border border-border">
              <h3 className="font-bold text-lg mb-4 text-foreground">About & Interests</h3>
              <p className="text-muted-foreground mb-6">{member.about}</p>

              <div className="grid grid-cols-2 gap-4">
                {member.primaryFocus && (
                  <div className="p-4 border border-border rounded-[--radius-md]">
                    <h4 className="text-primary font-bold">Primary Focus</h4>
                    <p className="text-sm text-foreground">{member.primaryFocus}</p>
                  </div>
                )}
                {member.clubContribution && (
                  <div className="p-4 border border-border rounded-[--radius-md]">
                    <h4 className="text-primary font-bold">Club Contribution</h4>
                    <p className="text-sm text-foreground">{member.clubContribution}</p>
                  </div>
                )}
              </div>
            </div>
                
            {/* Social Links Section */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-[--radius-lg] border border-border">
                <h3 className="font-bold mb-4 text-foreground">Connect Digitally</h3>
                <div className="space-y-2">
                  {member.socialLinks?.map((link) => {
                    const icon = platformIcons[link.platform.toLowerCase()] || <FaQuestion className="size-4" />;
                    
                    return (
                      <a 
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 hover:bg-secondary cursor-pointer border-b border-border text-sm text-foreground transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="capitalize">{link.platform}</span>
                        </div>
                        <span className="opacity-50">→</span>
                      </a>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-primary text-primary-foreground p-6 rounded-[--radius-lg]">
    <h3 className="text-xs uppercase opacity-80 mb-2">Current Status</h3>

            {member.projects
              ?.filter((project) => project.status_project === "in-progress")
              .map((project) => (
                <p key={project.documentId} className="font-bold">
                  ● {project.title}{" "}
                  <span className="font-normal opacity-80">
                    ({project.leader?.documentId === member.documentId ? "Leader" : "Member"})
                  </span>
                </p>
              ))}

            {member.projects?.filter((project) => project.status_project === "in-progress").length === 0 && (
              <p className="opacity-80">No active projects.</p>
            )}
  </div>
            </div>
          </div>
        </div>
    );
  };

  export default ProfilePage;