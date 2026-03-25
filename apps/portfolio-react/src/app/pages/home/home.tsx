import React from 'react';
import { useDatabase } from '../../data/database';
import Projects from '../projects/projects';
import styles from './home.module.scss';

export function Home() {
  const { siteContent } = useDatabase();

  if (!siteContent) {
    return null;
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.content}>
        <div className={styles.introSection}>
          <div className={styles.header}>{siteContent.header}</div>
          <div className={styles.subHeader}>{siteContent.subHeader}</div>
        </div>
        <div className={styles.mainGrid}>
          <div className={styles.aboutSection}>
            <div className={styles.aboutMe}>{siteContent.aboutMe}</div>
          </div>
          <div className={styles.profileSection}>
            <div className={styles.profilePictureContainer}>
              <div className={styles.profilePicture}>
                <img src={siteContent.profilePicture} alt="Will Strothe" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Projects />
    </div>
  );
}

export default Home;
