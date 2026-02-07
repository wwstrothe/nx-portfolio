import { Component, inject, Signal } from '@angular/core';
import { Database, SiteContent } from '../../data/database';
import Projects from '../projects/projects';

@Component({
  selector: 'portfolio-home',
  imports: [Projects],
  template: `
    <div class="home-page">
      @if (siteContent(); as content) {
        <div class="content">
          <div class="intro-section">
            <div class="header">{{ content.header }}</div>
            <div class="sub-header">{{ content.subHeader }}</div>
          </div>
          <div class="main-grid">
            <div class="about-section">
              <div class="about-me">{{ content.aboutMe }}</div>
            </div>
            <div class="profile-section">
              <div class="profile-picture-container">
                <div class="profile-picture">
                  <img [src]="content.profilePicture" alt="William Strothe" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <portfolio-projects [useShortDescription]="true" />
      }
    </div>
  `,
  styleUrls: ['./home.scss'],
})
export default class Home {
  private database = inject(Database);
  protected readonly siteContent: Signal<SiteContent | null> = this.database.siteContent;

  constructor() {
    // * Uncomment the line below to reset the database with the raw data
    this.database.saveInitialData();
  }
}
