import { FC, useEffect } from 'react';
import styles from './entry.module.less';

const ChaptersCover: FC<any> = ({
  sectionVal,
  title,
  subheadingEn
}) => {

  // const [state, setState] = useState<>();

  useEffect(() => {

  }, []);

  return (
    <div className={styles.chaptersCoverCon}>
      <div className={styles.chaptersCoverImg}>
        <img
          src='https://staticres.linhuiba.com/project-custom/location-insight/bg_chapters_cover_pdf@2x.png'
          width='100%'
          height='100%'/>
      </div>
      {
        sectionVal ? <div className={styles.chaptersIndex}>
          {sectionVal}
        </div> : null
      }
      <div>
        <div className={styles.titCon}>
          {title}
        </div>
        <div className='fs-18'>
          {subheadingEn}
        </div>
      </div>
    </div>
  );
};

export default ChaptersCover;
