// export class registerDetail {
//     id: number=0;
//     creationDate?: Date;
//     modificationDate?: Date;
//     createdBy?: any;
//     userGroup?: any;
//     modifyiedBy?: any;
//     createdByTeam?: any;
//     modifyiedByTeam?: any;
//     managerName?: any;
//     contact?: any;
//     companyName?: any;
//     contactName?: any;
//     email?: any;
//     mobile?: any;
//     otherInformation?: any;
//     numberOfCircuits?: any;
//     fullAddress?: any;
//     exchangeName?: any;
//     nearestFixedLineNumber?: any;
//     expectedUpgrades?: any;
//     notes?: any;
//     name?: any;
//     circuitProtection?: boolean;
//     pathProtection?: boolean;
//     promisingArea?: boolean;
//     serviceTypeID?: any;
//     serviceType?: any;
//     serviceSpeedID?: any;
//     serviceSpeed?: any;
//     numberOfSpeed?:any;
//     statusId?:any;
//     acceptstatusId:any;
//     status?:any;
//     contractPeriod:any;

// }


export class registerDetail{
  acceptstatusId: any
  circuitProtection?: boolean
  companyName?: string
  contact?: string
  contactName?: string
  contractPeriod: any
  createdBy?: string
  createdByTeam?: string
  creationDate?: string
  email?: string
  exchangeName?: string
  expectedUpgrades?: any
  fullAddress?: string
  id: number=0
  managerName?: string
  mobile?: string
  modificationDate?: Date
  modifyiedBy?: any
  modifyiedByTeam?: any
  name?: any
  nearestFixedLineNumber?: any
  notes?: any
  numberOfCircuits?: number
  numberOfSpeed?: any
  otherInformation?: any
  pathProtection?: boolean
  promisingArea?: boolean
  rejectionReason?: any
  renew?: any
  sectorID?: any
  serviceSpeedID?: any
  serviceSpeed= null
  serviceType=null
  serviceTypeID?: any
  statusId?: number
  signature?:string
signatureName?:string
renewedBy?:string
renewedDate?:Date
ForwardedDate?:Date
ForwardedTo?:string
canRenew?:boolean
  sector=null
  status=null
  acceptableStatus=null
}

