import { FC, ReactNode } from 'react';
import useComovementRelations from '../hooks/useComovementRelations';

interface ComovementRelationProps {
  name?: string,
  propertyId?: number,
  children?: ReactNode;
  comovementRelations?: any;
  type: 'resmng'|'resmngka'|'resaudit';
}

const ComovementRelation: FC<ComovementRelationProps> = ({
  name,
  propertyId,
  comovementRelations,
  type,
  children
}) => {
  const isShow = useComovementRelations(name, propertyId, comovementRelations, type);
  return (
    <>
      {isShow && children}
    </>
  );
};

export default ComovementRelation;

