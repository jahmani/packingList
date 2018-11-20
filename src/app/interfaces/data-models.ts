export class DataModels {}
/*
  Generated class for the DataModels provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export interface CatTreeNodeExtension {
  $parent?: Extended<TreeNode>;
  $sons?: Extended<TreeNode>[];
  $isExpanded?: boolean;
  catigory?: Extended<TransactionCatigory>;
}
export interface OpenPhotoRules {
  canSelect?: boolean;
  canUpload?: boolean;
  canremove?: boolean;
}
export interface AccountInfoExt {
  $balance?: number;
  $computedLastEditedOn?: string;
  $balanceObj?: Extended<AccountBalance>;
}

export interface TransactionExt {
  currentBalance?: number;
  imageFile?: Extended<ImageFile>;
}
export interface StoreUserExt {
  user?: User;
}
export interface UserStoreExt {
  store?: StoreInfo;
}
export interface InviteExt {
  store?: StoreDoc;
  user?: User;
}
export interface OrderExt {
  account?: Extended<AccountInfo>;
  extRows?: Extended<OrderRow2>[];
}

export interface OrderRowExt {
  Product?: Extended<Product>;
  state?: "EMPTY"|"NEW"|"EDITED"|"ADDED"|"DELETED"|"NONE";
}

export type ExtType = CatTreeNodeExtension &
  AccountInfoExt &
  StoreUserExt &
  UserStoreExt &
  TransactionExt &
  OrderExt &
  OrderRowExt & {};
export interface Meta {
  fromCache: boolean;
  hasPendingWrites: boolean;
}
export interface Extended<T> {
  id: string;
  data: T;
  ext?: ExtType;
  meta?: Meta;
}

export class ExtMap<T> {
  map: Map<string, T>;
  toArray() {
    return Array.from(this.map.values());
  }
  get(key) {
    return this.map.get(key);
  }
  set(key: string, value: T) {
    return this.map.set(key, value);
  }
  forEach(
    callbackfn: (value: T, key: string, map: Map<string, T>) => void,
    thisArg?: any
  ): void {
    return this.map.forEach(callbackfn);
  }
  constructor(vals?) {
    this.map = new Map<string, T>(vals);
  }
}

export interface Editable {
  firstCreatedOn: string | any;
  lastEditedOn: string | any;
  lastEditedByUserId: string;
}
export interface Delteable {
  isDelted: boolean;
}
export interface Product extends Editable {
  name: string;
  translatedName: {
    ar?: string;
    en?: string;
    ch?: string;
  };
  code: string;
  style: string;
  notice: string;
  thumbUrl: string;
  images: string[];
}
export interface AccountInfo extends Editable {
  name: string;
  code: string;
  mobile: string;
  city: string;
  address: string;
}
export interface User extends Editable {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  name: string;
  code: string;
  mobile: string;
  city: string;
  address: string;
  role: string;
}
export interface StoreUser extends Editable {
  dateTimeAdded: string | any;
  isEnabled: true;
  role: string;
  canRead: boolean;
  canWrite: boolean;
  inviteId: string;
}

export interface UserStore extends Editable {
  inviteId: string;
  isDefault: boolean;
}

export enum AccountType {
  GeneralCredit = -1,
  GeneralDebt = 1
}

export interface ImageFile extends Editable, Delteable {
  name: string;
  url: string;
  thumbUrl: string;
  size: number;
  width: number;
  height: number;
  tags: string[];
}
export interface Transaction extends Editable, Delteable {
  accountId: string;
  date: string;
  type: TransactionType;
  imageSrc: string;
  notice: string;
  ammount: number;
  currency: string;
  catigoryId: string;
}
export interface Order extends Editable, Delteable {
  accountId: string;
  date: string;
  deliveryDate: string;
  imageUrl: string;
  notice: string;
  ammount: number;
  currency: string;
  cbm: number;
  rows:  OrderRow2[];
  packingListId: string;
}

export interface PackinglistInfo extends Editable, Delteable {
  name: string;
  date: string;
  deliveryDate: string;
  deliveryAdress: string;
  notice: string;
  ammount: number;
  ctns: number;
  cbm: number;
}
export interface OrderRow2 {
  // orderId: string;
  productId: string;
  notice: string;
  qty: number;
  price: number;
  ammount: number;
  packingLines: PackingLine[];
  sequence: number;

  defaultShippingMark: string;
  defaultCtnNumber: string;
}
export interface OrderRow extends Editable, Delteable {
  [x: string]: any;
  orderId: string;
  productId: string;
  shippingMark: string;
  notice: string;
  qty: number;
  price: number;
  ammount: number;
  packingLines: PackingLine[];
  packing: number;

  d_ctns: number;
  d_siblingPLLineId: string;
}
export interface PackingLine {
  shippingMark: string;
  ctnNo: string;
  notice: string;
  packing: number;
  ctns: number;
  groupId: string;
}
export interface AccountBalance extends Editable {
  balance: number;
  lastTransactionId: string;
  isDirty: boolean;
  isInvalid: boolean;
}

export interface TreeNode {
  parentId: string;
  name: string;
}
export interface TransactionCatigory extends TreeNode, Editable {
  type: TransactionType;
  isCredit: boolean;
  isDebit: boolean;
}

export enum TransactionType {
  Credit = -1,
  Debt = 1
}
export type InviteState =
  | "ACCEPTED"
  | "REVOKED"
  | "REJECTED"
  | "CANCELED"
  | "PENDING"
  | "LEAVED";
export interface Invite extends Editable {
  userId: string;
  storeId: string;
  state: InviteState;
}
export interface StoreDoc extends Editable {
  storeInfo: StoreInfo;
}

export interface StoreInfo extends Editable {
  name: string;
  code: string;
  users: string[];
}

export enum ItemChangeState {
  INITIALISED,
  ADDED,
  CHANGED,
  REMOVED
}
export enum ItemEditState {
  ADD,
  CHANGE,
  REMOVE
}

export interface DataLog<T extends Editable> extends Editable {
  path: string;
  key: string;
  data: T;
  oldData?: T;
  type: string;
  dateTime: string;
  // tableName: string;
  message: string;
  $dateBreak: string;
  user: string;
}
