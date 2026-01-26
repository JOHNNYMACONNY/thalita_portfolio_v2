"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

import { Project } from "@/app/types";

interface PortfolioGridProps {
    projects: Project[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
    // Projects are passed in already filtered or we can filter here.
    // Assuming the parent passes all projects, we filter for featured.
    const displayProjects = projects.filter(p => p.isFeatured);

    if (displayProjects.length === 0) return null;

    const mainProject = displayProjects[0];
    // If there are less than 2 projects, gridProjects will be empty, which is fine
    const gridProjects = displayProjects.slice(1);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <ProjectCard
                    title={mainProject.title}
                    category={mainProject.categories?.[0] || mainProject.role}
                    imageSrc={mainProject.coverImage}
                    href={`/work/${mainProject.slug}`}
                    size="landscape"
                    priority={true}
                />
            </motion.div>

            {gridProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gridProjects.map((project, index) => (
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
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}
