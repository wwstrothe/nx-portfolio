import { RESUME } from '../../data/resume';
import styles from './resume.module.scss';

export function Resume() {
  const resume = RESUME;

  return (
    <div className={styles.resumeContainer}>
      <div className={styles.downloadSection}>
        <a className={styles.downloadButton} href="/resume.pdf" download>
          <span>⬇</span> Download Resume (PDF)
        </a>
      </div>

      <div className={styles.resumeHeader}>
        <h1 className={styles.name}>{resume.name}</h1>
        <p className={styles.subHeader}>{resume.subHeader}</p>
        <p className={styles.contactInfo}>
          {resume.location} • {resume.cellPhone} • {resume.email}
        </p>
      </div>

      <section className={styles.resumeSection}>
        <h2 className={styles.sectionTitle}>Professional Summary</h2>
        <p className={styles.summaryText}>{resume.professionalSummary}</p>
      </section>

      <section className={styles.resumeSection}>
        <h2 className={styles.sectionTitle}>Technical Skills</h2>
        <div className={styles.skillsGrid}>
          {resume.technicalSkills.map((skillGroup) => (
            <div className={styles.skillCategory} key={skillGroup.category}>
              <p className={styles.categoryName}>
                <strong>{skillGroup.category}</strong>
              </p>
              <p className={styles.skillsList}>{skillGroup.skills.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.resumeSection}>
        <h2 className={styles.sectionTitle}>Professional Experience</h2>
        {resume.proffesionalExperience.map((exp) => (
          <div className={styles.experienceEntry} key={`${exp.company}-${exp.role}`}>
            <div className={styles.experienceHeader}>
              <h3 className={styles.position}>
                {exp.role} – {exp.department}
              </h3>
              <p className={styles.companyLocation}>
                {exp.company} – {exp.location} | {exp.startDate} – {exp.endDate}
              </p>
            </div>
            <ul className={styles.bulletPoints}>
              {exp.bulletPoints.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.resumeSection}>
        <h2 className={styles.sectionTitle}>Projects</h2>
        {resume.projects.map((project) => (
          <div className={styles.projectEntry} key={project.title}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectTech}>{project.technologies.join(', ')}</p>
            <ul className={styles.bulletPoints}>
              {project.bulletPoints.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.resumeSection}>
        <h2 className={styles.sectionTitle}>Education</h2>
        {resume.education.map((edu) => (
          <div className={styles.educationEntry} key={`${edu.institution}-${edu.fieldOfStudy}`}>
            <div className={styles.educationHeader}>
              <h3 className={styles.institution}>{edu.institution}</h3>
              <p className={styles.fieldStudy}>{edu.fieldOfStudy}</p>
            </div>
            <p className={styles.completionDate}>{edu.completionDate}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Resume;
