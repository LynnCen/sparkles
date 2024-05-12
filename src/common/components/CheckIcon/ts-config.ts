interface IconModalProps {
  visible: boolean;
  color: string;
  iconLink: string;
}

export interface IProps {
  onChange: (icon: string) => void;
  iconModal: IconModalProps;
  closeModal: Function;
}
