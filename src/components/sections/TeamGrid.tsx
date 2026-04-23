import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';

export interface TeamMember {
  _id: string;
  name: string;
  title: string;
  photo?: { asset: { _ref: string }; alt?: string } | null;
}

export default function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {members.map((member) => {
        const photoUrl = member.photo
          ? urlFor(member.photo).width(400).height(400).fit('crop').auto('format').url()
          : null;

        return (
          <div key={member._id} className="flex flex-col">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-ap-surface mb-4">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={member.photo?.alt ?? member.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-ap-blue-light">
                  <span className="text-3xl font-bold text-ap-blue select-none">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <p className="font-semibold text-ap-dark text-[0.9375rem] leading-snug">
              {member.name}
            </p>
            <p className="text-sm text-ap-mid mt-0.5">{member.title}</p>
          </div>
        );
      })}
    </div>
  );
}
