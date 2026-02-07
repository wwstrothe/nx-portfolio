import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RESUME } from '../../data/resume';

@Component({
  selector: 'portfolio-resume',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-container">
      <!-- Download Button -->
      <div class="download-section">
        <a href="/resume.pdf" download class="download-button">
          <span>⬇</span> Download Resume (PDF)
        </a>
      </div>

      <!-- Header -->
      <div class="resume-header">
        <h1 class="name">{{ resume.name }}</h1>
        <p class="sub-header">{{ resume.subHeader }}</p>
        <p class="contact-info">
          {{ resume.location }} • {{ resume.cellPhone }} • {{ resume.email }}
        </p>
      </div>

      <!-- Professional Summary -->
      <section class="resume-section">
        <h2 class="section-title">Professional Summary</h2>
        <p class="summary-text">{{ resume.professionalSummary }}</p>
      </section>

      <!-- Technical Skills -->
      <section class="resume-section">
        <h2 class="section-title">Technical Skills</h2>
        <div class="skills-grid">
          <div *ngFor="let skillGroup of resume.technicalSkills" class="skill-category">
            <p class="category-name">
              <strong>{{ skillGroup.category }}</strong>
            </p>
            <p class="skills-list">{{ skillGroup.skills.join(', ') }}</p>
          </div>
        </div>
      </section>

      <!-- Professional Experience -->
      <section class="resume-section">
        <h2 class="section-title">Professional Experience</h2>
        <div *ngFor="let exp of resume.proffesionalExperience" class="experience-entry">
          <div class="experience-header">
            <h3 class="position">{{ exp.role }} – {{ exp.department }}</h3>
            <p class="company-location">
              {{ exp.company }} – {{ exp.location }} | {{ exp.startDate }} – {{ exp.endDate }}
            </p>
          </div>
          <ul class="bullet-points">
            <li *ngFor="let bullet of exp.bulletPoints">{{ bullet }}</li>
          </ul>
        </div>
      </section>

      <!-- Projects -->
      <section class="resume-section">
        <h2 class="section-title">Projects</h2>
        <div *ngFor="let project of resume.projects" class="project-entry">
          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-tech">{{ project.technologies.join(', ') }}</p>
          <ul class="bullet-points">
            <li *ngFor="let bullet of project.bulletPoints">{{ bullet }}</li>
          </ul>
        </div>
      </section>

      <!-- Education -->
      <section class="resume-section">
        <h2 class="section-title">Education</h2>
        <div *ngFor="let edu of resume.education" class="education-entry">
          <div class="education-header">
            <h3 class="institution">{{ edu.institution }}</h3>
            <p class="field-study">{{ edu.fieldOfStudy }}</p>
          </div>
          <p class="completion-date">{{ edu.completionDate }}</p>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./resume.scss'],
})
export default class Resume {
  resume = RESUME;
}
