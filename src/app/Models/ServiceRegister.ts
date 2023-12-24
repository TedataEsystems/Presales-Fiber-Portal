
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
forwardedDate?:Date
forwardedTo?:string
canRenew?:boolean
  sector=null
  status=null
  acceptableStatus=null
}

export interface AdvancedSearchDto {
  id?: number
  creationDateFrom?: string
  creationDateTo?: string
  modificationDateFrom?: string
  modificationDateTo?: string
  createdBy?: string
  modifyiedBy?: string
  createdByTeam?: string
  modifyiedByTeam?: string
  managerName?: string
  contact?: string
  companyName?: string
  contactName?: string
  email?: string
  mobile?: string
  numberOfCircuits?: number
  fullAddress?: string
  exchangeName?: string
  nearestFixedLineNumber?: string
  renewedBy?: string
  renewedDateFrom?: string
  renewedDateTo?: string
  forwardedDateFrom?: string
  forwardedDateTo?: string
  forwardedTo?: string
  rejectionReason?: string
  contractPeriod?: string
  serviceTypeID?: number
  serviceSpeedID?: number
  statusId?: number
  sectorID?: number
}
