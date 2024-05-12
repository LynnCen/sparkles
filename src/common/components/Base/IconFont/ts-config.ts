type ObjectString = { [propname: string]: string };
export interface IconType {
  iconHref: string;
  className?: string;
  style?: ObjectString;
  onClick?: Function;
}
