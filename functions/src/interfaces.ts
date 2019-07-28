export  interface UserStore {
    status: "INVITED" | "OWNER" | "ACTIVE";
    storeInfo: StoreInfo;
    isDefault: boolean;
  }
  export interface StoreInfo {
    name: string;
    code: string;
    users: string[];
  }
  export interface StoreUserPermesions {
    canReadProductImages: boolean;
    canReadProducts: boolean;
    canWriteProductImages: boolean;
    canWriteProducts: boolean;
  }
  export interface StoreUser {
    dateTimeAdded?: string | any;
    isEnabled: true;
    isAdmin: boolean;
    rule: string;
    permesions?: StoreUserPermesions;
    canRead?: boolean;
    canWrite?: boolean;
    userInfo: User;
  }
  export interface User  {
    id: string;
    email: string;
    displayName: string;
    photoURL: string;
    name: string;
    phoneNumber: string;
  }