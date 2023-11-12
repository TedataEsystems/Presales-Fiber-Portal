export interface FeedbackDto {
  id: number
  creationDate?: Date
  modificationDate?: Date
  createdBy?: string
  modifyiedBy?: string
  createdByTeam?: string
  modifyiedByTeam?: string
  availability?: string
  distance?: string
  comment?: string
  registerDetailID?: number
}
