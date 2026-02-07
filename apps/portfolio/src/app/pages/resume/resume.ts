import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { Database, Resume as ResumeData } from '../../data/database';

@Component({
  selector: 'portfolio-resume',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-container">
      @if (resume(); as resumeData) {
        <!-- Download Button -->
        <div class="download-section">
          <a href="pdfs/resume.pdf" download class="download-button">
            <span>⬇</span> Download Resume (PDF)
          </a>
        </div>

        <!-- Header -->
        <div class="resume-header">
          <h1 class="name">{{ resumeData.name }}</h1>
          <p class="sub-header">{{ resumeData.subHeader }}</p>
          <p class="contact-info">
            {{ resumeData.location }} • {{ resumeData.cellPhone }} • {{ resumeData.email }}
          </p>
        </div>

        <!-- Professional Summary -->
        <section class="resume-section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary-text">{{ resumeData.professionalSummary }}</p>
        </section>

        <!-- Technical Skills -->
        <section class="resume-section">
          <h2 class="section-title">Technical Skills</h2>
          <div class="skills-grid">
            @for (skillGroup of resumeData.technicalSkills; track skillGroup) {
              <div class="skill-category">
                <p class="category-name">
                  <strong>{{ skillGroup.category }}</strong>
                </p>
                <p class="skills-list">{{ skillGroup.skills.join(', ') }}</p>
              </div>
            }
          </div>
        </section>

        <!-- Professional Experience -->
        <section class="resume-section">
          <h2 class="section-title">Professional Experience</h2>
          @for (exp of resumeData.professionalExperience; track exp) {
            <div class="experience-entry">
              <div class="experience-header">
                <h3 class="position">{{ exp.role }} – {{ exp.department }}</h3>
                <p class="company-location">
                  {{ exp.company }} – {{ exp.location }} | {{ exp.startDate }} – {{ exp.endDate }}
                </p>
              </div>
              <ul class="bullet-points">
                @for (bullet of exp.bulletPoints; track bullet) {
                  <li>{{ bullet }}</li>
                }
              </ul>
            </div>
          }
        </section>

        <!-- Projects -->
        <section class="resume-section">
          <h2 class="section-title">Projects</h2>
          @for (project of resumeData.projects; track project) {
            <div class="project-entry">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-tech">{{ project.technologies.join(', ') }}</p>
              <ul class="bullet-points">
                @for (bullet of project.bulletPoints; track bullet) {
                  <li>{{ bullet }}</li>
                }
              </ul>
            </div>
          }
        </section>

        <!-- Education -->
        <section class="resume-section">
          <h2 class="section-title">Education</h2>
          @for (edu of resumeData.education; track edu) {
            <div class="education-entry">
              <div class="education-header">
                <h3 class="institution">{{ edu.institution }}</h3>
                <p class="field-study">{{ edu.fieldOfStudy }}</p>
              </div>
              <p class="completion-date">{{ edu.completionDate }}</p>
            </div>
          }
        </section>
      }
    </div>
  `,
  styleUrls: ['./resume.scss'],
})
export default class Resume {
  private database = inject(Database);
  protected readonly resume: Signal<ResumeData | null> = this.database.resume;
}
