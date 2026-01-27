"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

import { Project } from "@/app/types";

interface PortfolioGridProps {
    projects: Project[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
    // STABILITY GUARDRAIL: Critical component.
    // If no projects are passed, log warning to prevent silent grid disappearance.
    if (!projects || projects.length === 0) {
        console.error("[Stability] PortfolioGrid received 0 projects. Verify getProjects() in api.ts.");
        return null;
    }

    // Use all projects passed to the component
    const displayProjects = projects;

    if (displayProjects.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {displayProjects.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                    <ProjectCard
                        title={project.title}
                        category={project.categories?.[0] || project.role}
                        imageSrc={project.coverImage}
                        href={`/work/${project.slug}`}
                        size="portrait"
                        priority={index < 2}
                    />
                </motion.div>
            ))}
        </div>
    );
}
