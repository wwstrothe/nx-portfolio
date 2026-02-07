import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RESUME } from '../data/resume';

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
  styles: `
    .resume-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px;
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
      background-color: white;
    }

    /* Download Button */
    .download-section {
      text-align: center;
      margin-bottom: 30px;
    }

    .download-button {
      display: inline-block;
      background-color: #003366;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }

    .download-button:hover {
      background-color: #002244;
    }

    .download-button span {
      margin-right: 6px;
    }

    /* Header */
    .resume-header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 1px solid #333;
      padding-bottom: 20px;
    }

    .name {
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 0 0 10px 0;
      color: #003366;
    }

    .sub-header {
      font-size: 13px;
      margin: 0 0 5px 0;
      color: #003366;
    }

    .sub-header a {
      color: #003366;
      text-decoration: none;
    }

    .contact-info {
      font-size: 12px;
      margin: 0;
      color: #333;
    }

    /* Section Styling */
    .resume-section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 20px 0 12px 0;
      color: #003366;
      text-transform: uppercase;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }

    /* Technical Skills */
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .skill-category {
      margin-bottom: 8px;
    }

    .category-name {
      font-size: 12px;
      font-weight: bold;
      margin: 0 0 3px 0;
      color: #333;
    }

    .skills-list {
      font-size: 12px;
      margin: 0;
      color: #555;
    }

    /* Professional Summary */
    .summary-text {
      font-size: 12px;
      line-height: 1.7;
      color: #333;
      margin: 0;
    }

    /* Experience */
    .experience-entry {
      margin-bottom: 18px;
    }

    .experience-header {
      margin-bottom: 8px;
    }

    .position {
      font-size: 13px;
      font-weight: bold;
      margin: 0 0 3px 0;
      color: #003366;
    }

    .company-location {
      font-size: 12px;
      margin: 0;
      color: #666;
    }

    /* Projects */
    .project-entry {
      margin-bottom: 18px;
    }

    .project-title {
      font-size: 13px;
      font-weight: bold;
      margin: 0 0 3px 0;
      color: #003366;
    }

    .project-tech {
      font-size: 11px;
      font-style: italic;
      margin: 0 0 5px 0;
      color: #666;
    }

    /* Education */
    .education-entry {
      margin-bottom: 12px;
    }

    .education-header {
      margin-bottom: 3px;
    }

    .institution {
      font-size: 13px;
      font-weight: bold;
      margin: 0;
      color: #003366;
    }

    .field-study {
      font-size: 12px;
      margin: 0;
      color: #555;
    }

    .completion-date {
      font-size: 11px;
      color: #888;
      margin: 0;
      font-style: italic;
    }

    /* Bullet Points */
    .bullet-points {
      margin: 8px 0 0 20px;
      padding: 0;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
    }

    .bullet-points li {
      margin-bottom: 6px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .resume-container {
        padding: 20px;
      }

      .name {
        font-size: 24px;
      }

      .skills-grid {
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 13px;
      }
    }
  `,
})
export default class Resume {
  resume = RESUME;
}
