import { Component } from '@angular/core';
import { SITE_CONTENT } from '../../data/content';
import Projects from '../projects/projects';

@Component({
  selector: 'portfolio-home',
  imports: [Projects],
  template: `
    <div class="home-page">
      <div class="content">
        <div class="intro-section">
          <div class="header">{{ siteContent.header }}</div>
          <div class="sub-header">{{ siteContent.subHeader }}</div>
        </div>
        <div class="main-grid">
          <div class="about-section">
            <div class="about-me">{{ siteContent.aboutMe }}</div>
          </div>
          <div class="profile-section">
            <div class="profile-picture-container">
              <div class="profile-picture">
                <img [src]="siteContent.profilePicture" alt="Will Strothe" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <portfolio-projects [useShortDescription]="true" />
    </div>
  `,
  styleUrls: ['./home.scss'],
})
export default class Home {
  siteContent = SITE_CONTENT;
}
