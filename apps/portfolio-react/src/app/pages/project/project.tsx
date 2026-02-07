import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Project as ProjectType } from '../../data/projects';
import { PROJECTS } from '../../data/projects';
import styles from './project.module.scss';

const titleCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getStatusClassName = (status: ProjectType['status']) => {
  const statusMap: Record<ProjectType['status'], string> = {
    active: styles.statusActive,
    wip: styles.statusWip,
    archived: styles.statusArchived,
  };

  return `${styles.status} ${statusMap[status]}`;
};

export function Project() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const project = useMemo(() => {
    if (!slug) {
      return null;
    }

    return PROJECTS.find((item) => item.slug === slug) ?? null;
  }, [slug]);

  const goBack = () => {
    navigate('/projects');
  };

  if (!project) {
    return (
      <div className={styles.projectNotFound}>
        <h2>Project not found</h2>
        <button className={styles.backBtn} onClick={goBack} type="button">
          &larr; Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className={styles.projectDetail}>
      <button className={styles.backBtn} onClick={goBack} type="button">
        &larr; Back to Projects
      </button>

      {project.thumbnailUrl && (
        <div className={styles.projectThumbnail}>
          <img src={project.thumbnailUrl} alt={project.title} />
        </div>
      )}

      <div className={styles.projectHeader}>
        <h1 className={styles.projectTitle}>{project.title}</h1>
        <div className={styles.projectMeta}>
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
        </div>
      </div>

      <div className={styles.projectContent}>
        <p className={styles.projectDescription}>{project.description}</p>

        {project.videoUrl && (
          <div className={styles.projectVideo}>
            <iframe
              src={project.videoUrl}
              title={`${project.title} demo video`}
              width="100%"
              height="600"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {project.galleryUrls && project.galleryUrls.length > 0 && (
          <div className={styles.projectGallery}>
            <h3>Gallery</h3>
            <div className={styles.galleryGrid}>
              {project.galleryUrls.map((imageUrl) => (
                <div key={imageUrl} className={styles.galleryItem}>
                  <img src={imageUrl} alt={project.title} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.projectLinks}>
          <a
            className={`${styles.linkBtn} ${styles.primary}`}
            href={project.repoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Repository
          </a>
          {project.liveLink && (
            <a
              className={`${styles.linkBtn} ${styles.secondary}`}
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;
