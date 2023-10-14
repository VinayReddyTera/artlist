export interface MenuItem {
    id?: number;
    label?:any
    icon?:any
    link?:any
    subItems?: any;
    isTitle?: boolean;
    badge?: any;
    parentId?: number;
    isLayout?: boolean;
    role?:String[];
}
