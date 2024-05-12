import { FC, useEffect } from 'react';
import styles from './entry.module.less';
import ListTitle from './PdfList/components/ListTitle';

const ChaptersCover: FC<any> = ({
  sectionVal,
  title,
  subheadingEn
}) => {


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
        title && <ListTitle
          size='large'
          index={sectionVal}
          title={title}
          subheadingEn={subheadingEn}/>
      }
    </div>
  );
};

export default ChaptersCover;
