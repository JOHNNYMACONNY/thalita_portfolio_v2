import Link from "next/link";
import { Project } from "@/app/types";

interface ProjectNavigationProps {
    nextProject: Project | null;
}

export default function ProjectNavigation({ nextProject }: ProjectNavigationProps) {
    if (!nextProject) return null;

    return (
        <div className="flex justify-end pt-12 pb-12 border-t border-charcoal/10 mt-24">
            <Link
                href={`/work/${nextProject.slug}`}
                className="group text-right"
            >
                <div className="text-xs uppercase tracking-widest text-charcoal/60 mb-2 group-hover:text-magenta transition-colors">
                    Next Project
                </div>
                <div className="text-3xl font-heading text-charcoal group-hover:text-magenta transition-colors">
                    {nextProject.title} →
                </div>
            </Link>
        </div>
    );
}
