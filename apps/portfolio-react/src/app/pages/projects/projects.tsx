import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../../data/projects';
import styles from './projects.module.scss';

const titleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getStatusClassName = (status: string) => {
  const statusMap: Record<string, string> = {
    active: styles.statusActive,
    wip: styles.statusWip,
    archived: styles.statusArchived,
  };
  return `${styles.status} ${statusMap[status] || ''}`;
};

export function Projects() {
  const navigate = useNavigate();
  const projects = PROJECTS;

  const navigateToProject = (slug: string) => {
    navigate(`/project/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, slug: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateToProject(slug);
    }
  };

  return (
    <div>
      <h1 className={styles.sectionTitle}>Projects</h1>
      <div className={styles.projects}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={styles.projectCard}
            role="button"
            tabIndex={0}
            onClick={() => navigateToProject(project.slug)}
            onKeyDown={(e) => handleKeyDown(e, project.slug)}
          >
            <h3>{project.title}</h3>
            <p>{project.shortDescription}</p>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={getStatusClassName(project.status)}>
              {project.status === 'wip' ? 'Work in Progress' : titleCase(project.status)}
            </div>
            <div className={styles.links}>
              <a
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Repository
              </a>
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
